import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { chartColours, UniqueChartColours } from '@/lib/chartHelpers/colours';
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
  sequence?: number;
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
  [InequalitiesTypes.Deprivation]: chartColours,
};

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export const groupHealthDataBySex = (healthData: HealthDataPoint[]) => {
  return Object.groupBy(healthData, (data) => data.sex.value);
};

export const groupHealthDataByDeprivation = (healthData: HealthDataPoint[]) => {
  return Object.groupBy(healthData, (data) => data.deprivation.value);
};

export const getYearDataGroupedByInequalities = (
  type: InequalitiesTypes,
  yearlyHealthData: Record<string, HealthDataPoint[] | undefined>
) => {
  const yearlyDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities =
    {};

  for (const year in yearlyHealthData) {
    if (type === InequalitiesTypes.Deprivation) {
      yearlyDataGroupedByInequalities[year] = groupHealthDataByDeprivation(
        yearlyHealthData[year] ?? []
      );
    } else {
      yearlyDataGroupedByInequalities[year] = groupHealthDataBySex(
        yearlyHealthData[year] ?? []
      );
    }
  }

  return yearlyDataGroupedByInequalities;
};

export const mapToInequalitiesTableData = (
  type: InequalitiesTypes,
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((year) => {
    // TODO: Do you need this sorting?
    const sortedInequalitiesForYear = Object.entries(
      yearDataGroupedByInequalities[year]
    )
      .toSorted(
        ([, aValue], [, bValue]) =>
          aValue?.[0].deprivation.sequence ??
          0 - (bValue?.[0].deprivation.sequence ?? 0)
      )
      .map((x) => x[0]);
    const dynamicFields = sortedInequalitiesForYear.reduce(
      (acc: Record<string, RowDataFields | undefined>, inequality: string) => {
        const currentTableKey = yearDataGroupedByInequalities[year][inequality];
        acc[inequality] = currentTableKey?.at(0)
          ? {
              count: currentTableKey[0].count,
              value: currentTableKey[0].value,
              lower: currentTableKey[0].lowerCi,
              upper: currentTableKey[0].upperCi,
              isAggregate: currentTableKey[0].isAggregate,
              benchmarkComparison: currentTableKey[0].benchmarkComparison,
              sequence:
                type === InequalitiesTypes.Deprivation
                  ? currentTableKey[0].deprivation.sequence
                  : undefined,
            }
          : undefined;
        return acc;
      },
      {}
    );

    return { period: Number(year), inequalities: { ...dynamicFields } };
  });
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], currentYear) => {
    const sortedCurrentYearInequalityNames = Object.entries(currentYear)
      // TODO: Need to make this work for sex as well
      // .toSorted(([aKey], [bKey]) => localeSort(bKey, aKey))
      // TODO: Pass a function in to select this value to sort by?
      .toSorted(
        ([, aValue], [, bValue]) =>
          aValue?.[0].deprivation.sequence ??
          0 - (bValue?.[0].deprivation.sequence ?? 0)
      )
      .map((x) => x[0]);
    allKeys = [...allKeys, ...sortedCurrentYearInequalityNames];
    return allKeys;
  }, []);

  const uniqueKeys = [...new Set(existingKeys)];
  return uniqueKeys;
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

  const sortedKeys = Object.entries(inequalities)
    .sort(([nameA, _dataA], [nameB, _dataB]) => localeSort(nameA, nameB))
    .sort(
      ([_nameA, dataA], [_keyB, dataB]) =>
        (dataB?.sequence ?? 0) - (dataA?.sequence ?? 0)
    )
    .map(([key, _inequality]) => key);
  const inequalityDimensions = Object.entries(inequalities)
    .filter(([_key, inequality]) => !inequality?.isAggregate)
    .sort(([keyA, _inequalityA], [keyB, _inequalityB]) =>
      localeSort(keyA, keyB)
    )
    .sort(
      ([_keyA, inequalityA], [_keyB, inequalityB]) =>
        (inequalityB?.sequence ?? 0) - (inequalityA?.sequence ?? 0)
    )
    .map(([key, _inequality]) => key);

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
