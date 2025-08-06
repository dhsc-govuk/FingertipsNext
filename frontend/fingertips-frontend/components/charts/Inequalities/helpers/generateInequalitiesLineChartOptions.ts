import Highcharts from 'highcharts';
import { generateInequalitiesLineChartSeriesData } from '@/components/charts/Inequalities/helpers/generateInequalitiesLineChartSeriesData';
import { lineChartDefaultOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { generateXAxis } from '@/components/organisms/LineChart/helpers/generateXAxis';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import {
  getPeriodsWithInequalityData,
  InequalitiesChartData,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { generateYAxis } from '@/components/organisms/LineChart/helpers/generateYAxis';
import { getPeriodLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { Frequency } from '@/generated-sources/ft-api-client';

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
    indicatorName?: string;
    areaName?: string;
    frequency?: Frequency;
  }
): Highcharts.Options {
  const periodsWithInequalityData = getPeriodsWithInequalityData(
    inequalitiesLineChartData.rowData
  );
  const rowsWithInequalityData = inequalitiesLineChartData.rowData.filter(
    (row) => periodsWithInequalityData.includes(row.period)
  );

  const xCategoryKeys: number[] = [];
  const xCategoryValues: string[] = [];
  rowsWithInequalityData.forEach((row) => {
    const time = row.datePeriod?.from.getTime() ?? 0;
    if (xCategoryKeys.includes(time)) return;
    xCategoryKeys.push(time);
    xCategoryValues.push(row.period);
  });

  const seriesData = generateInequalitiesLineChartSeriesData(
    dynamicKeys,
    type,
    rowsWithInequalityData,
    optionalParams?.areasSelected ?? [],
    lineChartCI,
    optionalParams?.inequalityLineChartAreaSelected
  );

  const { frequency } = optionalParams ?? {};

  const periodType = rowsWithInequalityData.at(0)?.datePeriod?.type;
  const periodTypeLabel =
    periodType && frequency ? getPeriodLabel(periodType, frequency) : '';

  const fromDateLabel = xCategoryValues.at(0);
  const toDateLabel = xCategoryValues.at(-1);

  const fromTo = `from ${fromDateLabel} to ${toDateLabel}`;
  const areaName = optionalParams?.areaName
    ? `for ${optionalParams.areaName}`
    : '';
  const titleText = (
    optionalParams?.indicatorName
      ? `${optionalParams.indicatorName} inequalities ${areaName}${periodTypeLabel ? `, ${periodTypeLabel}` : ''} ${fromTo}`
      : `inequalities ${fromTo}`
  )
    .replaceAll(/\s+/g, ' ')
    .trim();

  const chartHeight =
    type === InequalitiesTypes.Deprivation
      ? Number(lineChartDefaultOptions.chart?.height) * 1.5
      : lineChartDefaultOptions.chart?.height;

  return {
    ...lineChartDefaultOptions,
    title: {
      text: titleText,
      style: {
        display: 'none',
      },
    },
    chart: {
      ...lineChartDefaultOptions.chart,
      height: chartHeight,
    },
    yAxis: generateYAxis(
      `${optionalParams?.yAxisTitleText}${optionalParams?.measurementUnit ? ': ' + optionalParams?.measurementUnit : ''}`
    ),
    xAxis: generateXAxis(xCategoryValues, optionalParams?.xAxisTitleText),
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
