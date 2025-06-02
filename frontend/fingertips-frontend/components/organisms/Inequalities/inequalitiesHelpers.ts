import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { chartColours, UniqueChartColours } from '@/lib/chartHelpers/colours';
import {
  AXIS_TITLE_FONT_SIZE,
  getFormattedLabel,
  generateConfidenceIntervalSeries,
  getHealthDataWithoutInequalities,
  isEnglandSoleSelectedArea,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import Highcharts, { DashStyleValue, YAxisOptions } from 'highcharts';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { lineChartDefaultOptions } from '../LineChart/helpers/generateStandardLineChartOptions';
import { chartSymbols } from '../LineChart/helpers/generateSeriesData';

export const localeSort = (a: string, b: string) => a.localeCompare(b);
export const sexCategory = 'Sex';

export enum ChartType {
  SingleTimePeriod = 'single-time-period',
  Trend = 'trend',
}

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

type InequalityValueSelector = (dataPoint: HealthDataPoint) => string;
type InequalitySequenceSelector = (dataPoint?: HealthDataPoint) => number;
type HealthDataFilterFunction = (dataPoint: HealthDataPoint) => boolean;

export interface InequalitiesChartData {
  areaCode: string;
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartData {
  areaCode: string;
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
  englandDataWithoutInequalities: HealthDataForArea | undefined;
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

export const reorderItemsArraysToEnd = (
  headers: string[],
  lastHeaders?: string[]
) => {
  if (!headers) return [];
  if (!lastHeaders) return headers;

  const filterHeaders = headers.filter((header) => {
    return !lastHeaders.includes(header);
  });
  lastHeaders.forEach((header) => {
    if (headers.includes(header)) filterHeaders.push(header);
  });
  return filterHeaders;
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
  sequenceSelector: InequalitySequenceSelector
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], yearDataRecord) => {
    const sortedCurrentYearInequalityNames = Object.entries(yearDataRecord)
      .sort(([aKey], [bKey]) => localeSort(bKey, aKey))
      .sort(
        ([, aValue], [, bValue]) =>
          sequenceSelector(bValue?.[0]) - sequenceSelector(aValue?.[0])
      )
      .map((x) => x[0]);
    allKeys = [...allKeys, ...sortedCurrentYearInequalityNames];
    return allKeys;
  }, []);

  // spreading a set ensures we have unique keys
  return [...new Set(existingKeys)];
};

const dashStyle = (index: number): DashStyleValue => {
  if (index < 3) return 'Solid';
  if (index < 8) return 'ShortDash';
  return 'Dash';
};

export const generateInequalitiesLineChartSeriesData = (
  keys: string[],
  type: InequalitiesTypes,
  chartData: InequalitiesChartData,
  areasSelected: string[],
  showConfidenceIntervalsData?: boolean,
  inequalitiesAreaSelected?: string
): Highcharts.SeriesOptionsType[] => {
  const colorList = mapToChartColorsForInequality[type];
  const yearsWithInequalityData = getYearsWithInequalityData(chartData.rowData);
  if (!yearsWithInequalityData.length) {
    throw new Error('no data for any year');
  }
  const firstYear = Math.min(...yearsWithInequalityData);
  const lastYear = Math.max(...yearsWithInequalityData);

  const seriesData: Highcharts.SeriesOptionsType[] = keys.flatMap(
    (key, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: key,
        data: chartData.rowData
          .filter((data) => data.period >= firstYear && data.period <= lastYear)
          .map((periodData) => [
            periodData.period,
            periodData.inequalities[key]?.value,
          ]),
        marker: {
          symbol: chartSymbols[index % chartSymbols.length],
        },
        color: colorList[index % colorList.length],
        dashStyle: dashStyle(index),
      };

      // We have different display requirements for the aggregate
      // data when England is the selected area
      if (
        index === 0 &&
        (isEnglandSoleSelectedArea(areasSelected) ||
          inequalitiesAreaSelected === areaCodeForEngland)
      ) {
        lineSeries.color = GovukColours.Black;
        lineSeries.marker = { symbol: 'circle' };
      }

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          key,
          chartData.rowData
            .filter(
              (data) => data.period >= firstYear && data.period <= lastYear
            )
            .map((data) => [
              data.period,
              data.inequalities[key]?.lower,
              data.inequalities[key]?.upper,
            ]),
          showConfidenceIntervalsData
        );

      return showConfidenceIntervalsData
        ? [lineSeries, confidenceIntervalSeries]
        : [lineSeries];
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
    inequalityLineChartAreaSelected?: string;
  }
): Highcharts.Options {
  const seriesData = generateInequalitiesLineChartSeriesData(
    dynamicKeys,
    type,
    inequalitiesLineChartData,
    optionalParams?.areasSelected ?? [],
    lineChartCI,
    optionalParams?.inequalityLineChartAreaSelected
  );

  const chartHeight =
    type === InequalitiesTypes.Deprivation
      ? Number(lineChartDefaultOptions.chart?.height) * 1.5
      : lineChartDefaultOptions.chart?.height;

  return {
    ...lineChartDefaultOptions,
    chart: {
      ...lineChartDefaultOptions.chart,
      height: chartHeight,
    },
    yAxis: {
      ...lineChartDefaultOptions.yAxis,
      title: {
        text: `${optionalParams?.yAxisTitleText}${optionalParams?.measurementUnit ? ': ' + optionalParams?.measurementUnit : ''}`,
        margin: 20,
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
      labels: {
        ...(lineChartDefaultOptions.yAxis as YAxisOptions)?.labels,
        formatter: function () {
          return getFormattedLabel(Number(this.value), this.axis.tickPositions);
        },
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
      headerFormat: '',
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(
          this,
          generateInequalitiesLineChartTooltipStringList
        );
      },
      useHTML: true,
    },
  } satisfies Highcharts.Options;
}

export const getAllDataWithoutInequalities = (
  dataWithoutEnglandOrGroup: HealthDataForArea[],
  benchmark: {
    englandIndicatorData?: HealthDataForArea;
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

  const englandDataWithoutInequalities: HealthDataForArea | undefined =
    benchmark.englandIndicatorData
      ? {
          ...benchmark.englandIndicatorData,
          healthData: getHealthDataWithoutInequalities(
            benchmark.englandIndicatorData
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
    englandDataWithoutInequalities: englandDataWithoutInequalities,
    groupDataWithoutInequalities,
  };
};

function hasHealthDataForInequalities(
  healthDataForArea: HealthDataForArea,
  inequalityType: InequalitiesTypes,
  year?: string
): boolean {
  if (year) {
    const healthDataPointsForYear = healthDataForArea.healthData.filter(
      (healthData) => healthData.year.toString() === year
    );

    if (healthDataPointsForYear.length === 0) {
      return false;
    }

    return (
      healthDataPointsForYear?.filter((healthDataForYear) =>
        inequalityType === InequalitiesTypes.Sex
          ? !healthDataForYear.sex.isAggregate
          : !healthDataForYear.deprivation.isAggregate
      ).length > 0
    );
  }
  const healthDataPointWithInequalities = healthDataForArea?.healthData?.filter(
    (data) =>
      inequalityType === InequalitiesTypes.Sex
        ? !data.sex.isAggregate
        : !data.deprivation.isAggregate
  );

  return healthDataPointWithInequalities.length > 0;
}

export const getAreasWithInequalitiesData = (
  healthIndicatorData: HealthDataForArea[],
  inequalityType: InequalitiesTypes,
  year?: string
) => {
  const areasWithInequalitiesData: AreaWithoutAreaType[] = [];

  healthIndicatorData.forEach((areaWithHealthData) => {
    if (
      hasHealthDataForInequalities(areaWithHealthData, inequalityType, year)
    ) {
      areasWithInequalitiesData.push({
        code: areaWithHealthData.areaCode,
        name: areaWithHealthData.areaName,
      });
    }
  });

  return areasWithInequalitiesData;
};

export const filterHealthData = (
  healthData: HealthDataPoint[],
  filterFn: HealthDataFilterFunction
): HealthDataPoint[] => {
  return healthData.filter(filterFn);
};

const getInequalityDeprivationCategories = (
  healthIndicatorData: HealthDataForArea,
  selectedYear?: number,
  chartType?: ChartType
): string[] => {
  const disaggregatedDeprivationData = filterHealthData(
    healthIndicatorData.healthData,
    (data) =>
      selectedYear
        ? data.year === selectedYear && !data.deprivation.isAggregate
        : !data.deprivation.isAggregate
  );

  const groupedByDeprivationType = Object.groupBy(
    disaggregatedDeprivationData,
    (data) => data.deprivation.type
  );

  if (chartType === ChartType.Trend) {
    const validCategories = Object.entries(groupedByDeprivationType)
      .filter(([, dataPoints]) => {
        const uniqueYears = new Set(dataPoints?.map((data) => data.year));
        return uniqueYears.size > 1;
      })
      .map(([type]) => type);

    return validCategories;
  }

  return Object.keys(groupedByDeprivationType);
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

export const isSexTypePresent = (
  dataPoints: HealthDataPoint[],
  selectedYear?: number
): boolean => {
  if (selectedYear) {
    return dataPoints.some(
      (point) => !point.sex.isAggregate && point.year === selectedYear
    );
  }
  return dataPoints.some((point) => !point.sex.isAggregate);
};

export const getInequalityCategories = (
  healthIndicatorData: HealthDataForArea,
  selectedYear?: number,
  chartType?: ChartType
) =>
  isSexTypePresent(healthIndicatorData.healthData, selectedYear)
    ? [
        ...getInequalityDeprivationCategories(
          healthIndicatorData,
          selectedYear,
          chartType
        ),
        sexCategory,
      ].toSorted(localeSort)
    : getInequalityDeprivationCategories(
        healthIndicatorData,
        selectedYear,
        chartType
      );

export const getInequalitiesType = (
  inequalityCategories: string[],
  inequalityTypeSelected?: string
): InequalitiesTypes => {
  if (
    (!inequalityTypeSelected && inequalityCategories[0] === sexCategory) ||
    inequalityTypeSelected === sexCategory
  )
    return InequalitiesTypes.Sex;
  return InequalitiesTypes.Deprivation;
};
