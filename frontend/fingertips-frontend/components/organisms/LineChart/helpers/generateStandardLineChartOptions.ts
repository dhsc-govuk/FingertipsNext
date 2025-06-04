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
import { generateYAxis } from './generateYAxis';
import { generateXAxis } from './generateXAxis';
import { generateTooltip } from './generateTooltip';
import { generateAccessibility } from './generateAccessibility';
import { generateSeriesData } from './generateSeriesData';
import Highcharts from 'highcharts';

export enum LineChartVariant {
  Standard = 'standard',
  Inequalities = 'inequalities',
}

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

export function generateStandardLineChartOptions(
  healthIndicatorData: HealthDataForArea[],
  lineChartCI: boolean,
  benchmarkToUse: string,
  optionalParams?: {
    indicatorName?: string;
    englandData?: HealthDataForArea;
    groupIndicatorData?: HealthDataForArea;
    yAxisTitle?: string;
    xAxisTitle?: string;
    measurementUnit?: string;
    accessibilityLabel?: string;
    xAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
    benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  }
): Highcharts.Options {
  const sortedHealthIndicatorData =
    sortHealthDataForAreasByDate(healthIndicatorData);
  const firstYear = getFirstYearForAreas(sortedHealthIndicatorData);
  const lastYear = getLatestYearForAreas(sortedHealthIndicatorData);

  const sortedEnglandData = optionalParams?.englandData
    ? sortHealthDataForAreaByDate(optionalParams?.englandData)
    : undefined;

  const filteredSortedEnglandData =
    sortedEnglandData &&
    sortedHealthIndicatorData.length &&
    firstYear &&
    lastYear
      ? {
          ...sortedEnglandData,
          healthData:
            sortedEnglandData?.healthData.filter(
              (data) => data.year >= firstYear && data.year <= lastYear
            ) ?? [],
        }
      : sortedEnglandData;

  const sortedGroupData = optionalParams?.groupIndicatorData
    ? sortHealthDataForAreaByDate(optionalParams?.groupIndicatorData)
    : undefined;

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

  const fromTo = `from ${firstYear} to ${lastYear}`;
  const titleText = optionalParams?.indicatorName
    ? `${optionalParams?.indicatorName} ${fromTo}`
    : fromTo;

  return {
    ...lineChartDefaultOptions,
    title: {
      text: titleText,
      style: {
        display: 'none',
      },
    },
    yAxis: generateYAxis(optionalParams?.yAxisTitle),
    xAxis: generateXAxis(
      optionalParams?.xAxisTitle,
      optionalParams?.xAxisLabelFormatter
    ),
    series: generateSeriesData(
      sortedHealthIndicatorData,
      filteredSortedEnglandData,
      filteredSortedGroupData,
      lineChartCI,
      benchmarkToUse
    ),
    tooltip: generateTooltip(
      sortedHealthIndicatorData,
      benchmarkToUse,
      optionalParams?.benchmarkComparisonMethod,
      optionalParams?.measurementUnit
    ),
    accessibility: generateAccessibility(optionalParams?.accessibilityLabel),
  };
}
