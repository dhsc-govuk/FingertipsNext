import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { chartColours, UniqueChartColours } from '@/lib/chartHelpers/colours';
import {
  AXIS_TITLE_FONT_SIZE,
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

type InequalityValueSelector = (dataPoint: HealthDataPoint) => string;
type InequalitySequenceSelector = (dataPoint?: HealthDataPoint) => number;
type HealthDataFilterFunction = (dataPoint: HealthDataPoint) => boolean;

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

export const valueSelectorForInequality: Record<
  InequalitiesTypes,
  InequalityValueSelector
> = {
  [InequalitiesTypes.Sex]: (dataPoint) => dataPoint.sex.value,
  [InequalitiesTypes.Deprivation]: (dataPoint) => dataPoint.deprivation.value,
};

export const sequenceSelectorForInequality: Record<
  InequalitiesTypes,
  InequalitySequenceSelector
> = {
  [InequalitiesTypes.Sex]: () => 0,
  [InequalitiesTypes.Deprivation]: (dataPoint) =>
    dataPoint?.deprivation.sequence ?? 0,
};

export const healthDataFilterFunctionGeneratorForInequality: Record<
  InequalitiesTypes,
  (category: string) => HealthDataFilterFunction
> = {
  [InequalitiesTypes.Sex]: () => (data: HealthDataPoint) =>
    data.deprivation.isAggregate && data.ageBand.isAggregate,
  [InequalitiesTypes.Deprivation]: (category) => (data: HealthDataPoint) =>
    data.sex.isAggregate &&
    data.ageBand.isAggregate &&
    (data.deprivation.isAggregate || data.deprivation.type == category),
};

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export const groupHealthDataByInequality = (
  healthData: HealthDataPoint[],
  valueSelector: InequalityValueSelector
) => {
  return Object.groupBy(healthData, (data) => valueSelector(data));
};

export const getYearDataGroupedByInequalities = (
  yearlyHealthData: Record<string, HealthDataPoint[] | undefined>,
  valueSelector: InequalityValueSelector
) => {
  const yearlyDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities =
    {};

  for (const year in yearlyHealthData) {
    yearlyDataGroupedByInequalities[year] = groupHealthDataByInequality(
      yearlyHealthData[year] ?? [],
      valueSelector
    );
  }

  return yearlyDataGroupedByInequalities;
};

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >,
  sequenceSelector: InequalitySequenceSelector
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((year) => {
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[year]
    ).reduce(
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
              sequence: sequenceSelector(currentTableKey[0]),
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
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
  sequenceSelector: InequalitySequenceSelector
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], currentYear) => {
    const sortedCurrentYearInequalityNames = Object.entries(currentYear)
      .sort(([aKey], [bKey]) => localeSort(bKey, aKey))
      .sort(
        ([, aValue], [, bValue]) =>
          sequenceSelector(bValue?.[0]) - sequenceSelector(aValue?.[0])
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

  const sortedInequalities = Object.entries(inequalities)
    .sort(([nameA], [nameB]) => localeSort(nameA, nameB))
    .sort(
      ([, inequalityA], [, inequalityB]) =>
        (inequalityB?.sequence ?? 0) - (inequalityA?.sequence ?? 0)
    );
  const sortedKeys = sortedInequalities.map(([key, _inequality]) => key);
  const inequalityDimensions = sortedInequalities
    .filter(([, inequality]) => !inequality?.isAggregate)
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
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
    },
    xAxis: {
      ...lineChartDefaultOptions.xAxis,
      title: {
        text: optionalParams?.xAxisTitleText,
        margin: 20,
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
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

export const filterHealthData = (
  healthData: HealthDataPoint[],
  filterFn: HealthDataFilterFunction
): HealthDataPoint[] => {
  return healthData.filter(filterFn);
};

export const getInequalityCategory = (
  type: InequalitiesTypes,
  healthIndicatorData: HealthDataForArea
) => {
  let inequalityCategory = '';
  if (type == InequalitiesTypes.Deprivation) {
    // This value will ultimately come from the inequality type dropdown
    // For now, we just use the first deprivation type available
    const disaggregatedDeprivationData = filterHealthData(
      healthIndicatorData.healthData,
      (data) => !data.deprivation.isAggregate
    );
    const deprivationTypes = Object.keys(
      Object.groupBy(
        disaggregatedDeprivationData,
        (data) => data.deprivation.type
      )
    );
    inequalityCategory = deprivationTypes[0];
  }
  return inequalityCategory;
};

export const getYearsWithInequalityData = (
  allData: InequalitiesTableRowData[]
): number[] =>
  allData.reduce((acc: number[], periodData: InequalitiesTableRowData) => {
    if (
      !(
        Object.keys(periodData.inequalities).length === 1 &&
        periodData.inequalities[Object.keys(periodData.inequalities)[0]]
          ?.isAggregate
      )
    )
      acc.push(periodData.period);
    return acc;
  }, []);
