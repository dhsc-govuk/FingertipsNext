import {
  HealthDataForArea,
  BenchmarkComparisonMethod,
} from '@/generated-sources/ft-api-client';
import {
  sortHealthDataForAreasByDate,
  getFirstYearForAreas,
  getLatestYearForAreas,
  sortHealthDataForAreaByDate,
  AXIS_LABEL_FONT_SIZE,
} from '@/lib/chartHelpers/chartHelpers';
import { ChartColours, chartColours } from '@/lib/chartHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SymbolKeyValue } from 'highcharts';
import { generateYAxis } from './generateYAxis';
import { generateXAxis } from './generateXAxis';
import { generateTooltip } from './generateTooltip';
import { generateAccessibility } from './generateAccessibility';
import { generateSeriesData } from './generateSeriesData';

export const lineChartDefaultOptions: Highcharts.Options = {
  credits: {
    enabled: false,
  },
  chart: {
    type: 'line',
    spacingBottom: 50,
    spacingTop: 20,
    animation: false,
    height: 500,
  },
  title: {
    style: {
      display: 'none',
    },
  },
  yAxis: {
    minorTickInterval: 'auto',
    minorTicksPerMajor: 2,
    labels: { style: { fontSize: AXIS_LABEL_FONT_SIZE } },
  },
  xAxis: {
    tickLength: 0,
    allowDecimals: false,
    labels: { style: { fontSize: AXIS_LABEL_FONT_SIZE } },
  },
  legend: {
    verticalAlign: 'top',
    align: 'left',
    itemStyle: {
      fontSize: '16px',
    },
    margin: 30,
  },
  accessibility: {
    enabled: false,
  },
  tooltip: {
    formatter: function (this: Highcharts.Point): string {
      return this.value?.toString() ?? '';
    },
  },
  plotOptions: {
    series: {
      animation: false,
    },
  },
};

export const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

const determineBenchmarkData = (
  benchmarkToUse: string,
  englandData?: HealthDataForArea,
  groupIndicatorData?: HealthDataForArea
): HealthDataForArea | undefined => {
  if (benchmarkToUse === areaCodeForEngland && englandData) {
    return sortHealthDataForAreaByDate(englandData);
  } else if (benchmarkToUse !== areaCodeForEngland && groupIndicatorData) {
    return sortHealthDataForAreaByDate(groupIndicatorData);
  }
  return undefined;
};

const determineGroupData = (
  benchmarkToUse: string,
  englandData?: HealthDataForArea,
  groupIndicatorData?: HealthDataForArea
): HealthDataForArea | undefined => {
  if (benchmarkToUse === areaCodeForEngland && groupIndicatorData) {
    return sortHealthDataForAreaByDate(groupIndicatorData);
  } else if (benchmarkToUse !== areaCodeForEngland && englandData) {
    return sortHealthDataForAreaByDate(englandData);
  }
  return undefined;
};

export function generateStandardLineChartOptions(
  healthIndicatorData: HealthDataForArea[],
  lineChartCI: boolean,
  benchmarkToUse: string,
  optionalParams?: {
    englandData?: HealthDataForArea;
    groupIndicatorData?: HealthDataForArea;
    yAxisTitle?: string;
    xAxisTitle?: string;
    measurementUnit?: string;
    accessibilityLabel?: string;
    colours?: ChartColours[];
    symbols?: SymbolKeyValue[];
    xAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
    benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  }
): Highcharts.Options {
  const sortedHealthIndicatorData =
    sortHealthDataForAreasByDate(healthIndicatorData);
  const firstYear = getFirstYearForAreas(sortedHealthIndicatorData);
  const lastYear = getLatestYearForAreas(sortedHealthIndicatorData);

  const sortedBenchMarkData = determineBenchmarkData(
    benchmarkToUse,
    optionalParams?.englandData,
    optionalParams?.groupIndicatorData
  );

  const filteredSortedBenchMarkData =
    sortedBenchMarkData &&
    sortedHealthIndicatorData.length &&
    firstYear &&
    lastYear
      ? {
          ...sortedBenchMarkData,
          healthData:
            sortedBenchMarkData?.healthData.filter(
              (data) => data.year >= firstYear && data.year <= lastYear
            ) ?? [],
        }
      : sortedBenchMarkData;

  const sortedGroupData = determineGroupData(
    benchmarkToUse,
    optionalParams?.englandData,
    optionalParams?.groupIndicatorData
  );

  const filteredSortedGroupData =
    sortedGroupData && sortedHealthIndicatorData.length && firstYear && lastYear
      ? {
          ...sortedGroupData,
          healthData:
            sortedGroupData?.healthData.filter(
              (data) => data.year >= firstYear && data.year <= lastYear
            ) ?? [],
        }
      : sortedGroupData;

  return {
    ...lineChartDefaultOptions,
    yAxis: generateYAxis(optionalParams?.yAxisTitle),
    xAxis: generateXAxis(
      optionalParams?.xAxisTitle,
      optionalParams?.xAxisLabelFormatter
    ),
    series: generateSeriesData(
      sortedHealthIndicatorData,
      optionalParams?.symbols ?? chartSymbols,
      optionalParams?.colours ?? chartColours,
      filteredSortedBenchMarkData,
      filteredSortedGroupData,
      lineChartCI
    ),
    tooltip: generateTooltip(
      sortedHealthIndicatorData,
      sortedBenchMarkData,
      sortedGroupData,
      optionalParams?.benchmarkComparisonMethod,
      optionalParams?.measurementUnit
    ),
    accessibility: generateAccessibility(optionalParams?.accessibilityLabel),
  };
}
