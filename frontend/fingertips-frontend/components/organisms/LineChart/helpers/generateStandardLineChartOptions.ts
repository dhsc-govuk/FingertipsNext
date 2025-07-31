import {
  HealthDataForArea,
  BenchmarkComparisonMethod,
  PeriodType,
  Frequency,
  DatePeriod,
} from '@/generated-sources/ft-api-client';
import {
  sortHealthDataForAreasByDate,
  sortHealthDataForAreaByDate,
  AXIS_LABEL_FONT_SIZE,
  getFirstPeriodForAreas,
} from '@/lib/chartHelpers/chartHelpers';
import { generateYAxis } from './generateYAxis';
import { generateXAxis } from './generateXAxis';
import { generateTooltip } from './generateTooltip';
import { generateAccessibility } from './generateAccessibility';
import { generateSeriesData } from './generateSeriesData';
import Highcharts from 'highcharts';
import {
  convertDateToNumber,
  formatDatePointLabel,
  getAdditionalPeriodLabel,
  getPeriodLabel,
} from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { filterHealthDataByPeriod } from './filterHealthDataByPeriod';

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
  periodType: PeriodType,
  frequency: Frequency,
  reportingPeriodFlag: boolean,
  latestDataPeriod?: DatePeriod,
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

  const firstDateAsNumber = getFirstPeriodForAreas(healthIndicatorData);
  const lastDateAsNumber = convertDateToNumber(latestDataPeriod?.to);

  // Sorts from earliest to latest data periods
  const sortedEnglandData = optionalParams?.englandData
    ? sortHealthDataForAreaByDate(optionalParams?.englandData)
    : undefined;

  // Filters out data points that are not within the specified period
  const filteredSortedEnglandData = filterHealthDataByPeriod(
    sortedEnglandData,
    firstDateAsNumber,
    lastDateAsNumber
  );

  // Sorts from earliest to latest data periods
  const sortedGroupData = optionalParams?.groupIndicatorData
    ? sortHealthDataForAreaByDate(optionalParams?.groupIndicatorData)
    : undefined;

  // Filters out data points that are not within the specified period
  const filteredSortedGroupData = filterHealthDataByPeriod(
    sortedGroupData,
    firstDateAsNumber,
    lastDateAsNumber
  );

  const categories: { key: number; value: string }[] =
    filteredSortedEnglandData?.healthData.map((point) => ({
      key: convertDateToNumber(point.datePeriod?.to),
      value: formatDatePointLabel(
        point.datePeriod,
        frequency,
        reportingPeriodFlag
      ),
    })) ?? [];

  const xCategoryKeys: number[] = categories.map((category) => category.key);
  const xCategoryValues: string[] = categories.map(
    (category) => category.value
  );

  const series = generateSeriesData(
    xCategoryKeys,
    sortedHealthIndicatorData,
    filteredSortedEnglandData,
    filteredSortedGroupData,
    lineChartCI,
    benchmarkToUse
  );

  const periodLabel = getPeriodLabel(periodType, frequency);
  const periodLabelText = periodLabel ? `${periodLabel} ` : '';
  const additionalPeriodLabelText =
    firstDateAsNumber && lastDateAsNumber
      ? getAdditionalPeriodLabel({
          type: periodType,
          from: new Date(firstDateAsNumber),
          to: new Date(lastDateAsNumber),
        })
      : '';

  const fromDateLabel = xCategoryValues.at(0);
  const toDateLabel = xCategoryValues.at(-1);

  const fromTo = `from ${fromDateLabel} to ${toDateLabel}`;
  const titleText = optionalParams?.indicatorName
    ? `${optionalParams?.indicatorName} ${periodLabelText}${additionalPeriodLabelText}${fromTo}`
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
    xAxis: generateXAxis(xCategoryValues, optionalParams?.xAxisTitle),
    series,
    tooltip: generateTooltip(
      sortedHealthIndicatorData,
      benchmarkToUse,
      optionalParams?.benchmarkComparisonMethod,
      optionalParams?.measurementUnit
    ),
    accessibility: generateAccessibility(optionalParams?.accessibilityLabel),
  };
}
