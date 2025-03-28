import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { UniqueChartColours } from '@/lib/chartHelpers/colours';
import {
  generateConfidenceIntervalSeries,
  getHealthDataWithoutInequalities,
  isEnglandSoleSelectedArea,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  chartSymbols,
  lineChartDefaultOptions,
} from '../LineChart/lineChartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

export const localeSort = (a: string, b: string) => a.localeCompare(b);

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export interface InequalitiesChartData {
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartData {
  areaName: string;
  data: InequalitiesTableRowData;
}

export interface RowDataFields {
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
  isAggregate?: boolean;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
}

export interface InequalitiesTableRowData {
  period: number;
  inequalities: {
    [key: string]: RowDataFields | undefined;
  };
}

interface DataWithoutInequalities {
  areaDataWithoutInequalities: HealthDataForArea[];
  englandBenchmarkWithoutInequalities: HealthDataForArea | undefined;
  groupDataWithoutInequalities: HealthDataForArea | undefined;
}

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  PERSONS = 'Persons',
}

export enum InequalitiesTypes {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

const mapToChartColorsForInequality: Record<InequalitiesTypes, string[]> = {
  [InequalitiesTypes.Sex]: [
    GovukColours.Orange,
    UniqueChartColours.OtherLightBlue,
    GovukColours.Purple,
  ],
  [InequalitiesTypes.Deprivation]: [],
};

export const inequalityKeyMapping: Record<
  InequalitiesTypes,
  (keys: string[]) => string[]
> = {
  [InequalitiesTypes.Sex]: (sexKeys: string[]) =>
    sexKeys.toSorted((a, b) => b.localeCompare(a)),
  [InequalitiesTypes.Deprivation]: (keys: string[]) => keys,
};

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export const groupHealthDataByInequalities = (
  healthData: HealthDataPoint[]
) => {
  return Object.groupBy(healthData, (data) => data.sex);
};

export const getYearDataGroupedByInequalities = (
  yearlyHealthData: Record<string, HealthDataPoint[] | undefined>
) => {
  const yearlyDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities =
    {};

  for (const year in yearlyHealthData) {
    yearlyDataGroupedByInequalities[year] = groupHealthDataByInequalities(
      yearlyHealthData[year] ?? []
    );
  }

  return yearlyDataGroupedByInequalities;
};

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((key) => {
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[key]
    ).reduce(
      (acc: Record<string, RowDataFields | undefined>, current: string) => {
        const currentTableKey = yearDataGroupedByInequalities[key][current];
        acc[current] = currentTableKey?.at(0)
          ? {
              count: currentTableKey[0].count,
              value: currentTableKey[0].value,
              lower: currentTableKey[0].lowerCi,
              upper: currentTableKey[0].upperCi,
              isAggregate: currentTableKey[0].isAggregate,
              benchmarkComparison: currentTableKey[0].benchmarkComparison,
            }
          : undefined;
        return acc;
      },
      {}
    );

    return { period: Number(key), inequalities: { ...dynamicFields } };
  });
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
  type: InequalitiesTypes
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], currentInequalityKeys) => {
    allKeys = [...allKeys, ...Object.keys(currentInequalityKeys)];
    return allKeys;
  }, []);

  const uniqueKeys = [...new Set(existingKeys)];

  return inequalityKeyMapping[type](uniqueKeys);
};

export const generateInequalitiesLineChartSeriesData = (
  keys: string[],
  type: InequalitiesTypes,
  chartData: InequalitiesChartData,
  areasSelected: string[],
  showConfidenceIntervalsData?: boolean
): Highcharts.SeriesOptionsType[] => {
  const colorList = mapToChartColorsForInequality[type];

  if (isEnglandSoleSelectedArea(areasSelected))
    colorList[0] = GovukColours.Black;

  const seriesData: Highcharts.SeriesOptionsType[] = keys.flatMap(
    (key, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: key,
        data: chartData.rowData.map((periodData) => [
          periodData.period,
          periodData.inequalities[key]?.value,
        ]),
        marker: {
          symbol: chartSymbols[index % chartSymbols.length],
        },
        color: colorList[index % colorList.length],
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          chartData.areaName,
          chartData.rowData.map((data) => [
            data.period,
            data.inequalities[key]?.lower,
            data.inequalities[key]?.upper,
          ]),
          showConfidenceIntervalsData
        );

      return [lineSeries, confidenceIntervalSeries];
    }
  );

  return seriesData;
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;

export const getAggregatePointInfo = (
  inequalities: Record<string, RowDataFields | undefined>
) => {
  const benchmarkPoint = Object.values(inequalities).find(
    (entry) => entry?.isAggregate
  );
  const benchmarkValue = benchmarkPoint?.value;
  const aggregateKey = Object.keys(inequalities).find(
    (key) => inequalities[key]?.isAggregate
  );

  const sortedKeys = Object.keys(inequalities).sort(localeSort);
  const inequalityDimensions = Object.keys(inequalities)
    .filter((key) => !inequalities[key]?.isAggregate)
    .sort(localeSort);

  return {
    benchmarkPoint,
    benchmarkValue,
    aggregateKey,
    sortedKeys,
    inequalityDimensions,
  };
};

export function generateInequalitiesLineChartOptions(
  inequalitiesLineChartData: InequalitiesChartData,
  dynamicKeys: string[],
  type: InequalitiesTypes,
  lineChartCI: boolean,
  generateInequalitiesLineChartTooltipStringList: (
    point: Highcharts.Point,
    symbol: string
  ) => string[],
  optionalParams?: {
    areasSelected?: string[];
    yAxisTitleText?: string;
    xAxisTitleText?: string;
    measurementUnit?: string;
  }
): Highcharts.Options {
  const seriesData = generateInequalitiesLineChartSeriesData(
    dynamicKeys,
    type,
    inequalitiesLineChartData,
    optionalParams?.areasSelected ?? [],
    lineChartCI
  );

  return {
    ...lineChartDefaultOptions,
    yAxis: {
      ...lineChartDefaultOptions.yAxis,
      title: {
        text: `${optionalParams?.yAxisTitleText}${optionalParams?.measurementUnit ? ': ' + optionalParams?.measurementUnit : ''}`,
        margin: 20,
      },
    },
    xAxis: {
      ...lineChartDefaultOptions.xAxis,
      title: { text: optionalParams?.xAxisTitleText, margin: 20 },
    },
    series: seriesData,
    tooltip: {
      headerFormat:
        `<span style="font-weight: bold">${inequalitiesLineChartData.areaName}</span><br/>` +
        '<span>Year {point.x}</span><br/>',
      pointFormatter: function (this: Highcharts.Point) {
        return (
          pointFormatterHelper(
            this,
            generateInequalitiesLineChartTooltipStringList
          ) +
          `${optionalParams?.measurementUnit ? ' ' + optionalParams?.measurementUnit : ''}</span></div></div>`
        );
      },
      useHTML: true,
    },
  };
}

export const getAllDataWithoutInequalities = (
  dataWithoutEnglandOrGroup: HealthDataForArea[],
  benchmark: {
    englandBenchmarkData?: HealthDataForArea;
    groupData?: HealthDataForArea;
  },
  areasSelected?: string[]
): DataWithoutInequalities => {
  const areaDataWithoutInequalities = !isEnglandSoleSelectedArea(areasSelected)
    ? dataWithoutEnglandOrGroup.map((data) => ({
        ...data,
        healthData: getHealthDataWithoutInequalities(data),
      }))
    : [];

  const englandBenchmarkWithoutInequalities: HealthDataForArea | undefined =
    benchmark.englandBenchmarkData
      ? {
          ...benchmark.englandBenchmarkData,
          healthData: getHealthDataWithoutInequalities(
            benchmark.englandBenchmarkData
          ),
        }
      : undefined;

  const groupDataWithoutInequalities: HealthDataForArea | undefined =
    benchmark.groupData
      ? {
          ...benchmark.groupData,
          healthData: getHealthDataWithoutInequalities(benchmark.groupData),
        }
      : undefined;

  return {
    areaDataWithoutInequalities,
    englandBenchmarkWithoutInequalities,
    groupDataWithoutInequalities,
  };
};
