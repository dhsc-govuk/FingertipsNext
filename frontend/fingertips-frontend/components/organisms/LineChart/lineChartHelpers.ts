import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { chartColours, ChartColours } from '@/lib/chartHelpers/colours';
import {
  sortHealthDataForAreasByDate,
  sortHealthDataForAreaByDate,
  generateConfidenceIntervalSeries,
  AXIS_TITLE_FONT_SIZE,
  AXIS_LABEL_FONT_SIZE,
  getTooltipContent,
  AreaTypeLabelEnum,
} from '@/lib/chartHelpers/chartHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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
    margin: 20,
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

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  parentIndicatorData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
) {
  const seriesData: Highcharts.SeriesOptionsType[] = data.flatMap(
    (item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: item.areaName,
        data: item.healthData.map((point) => [point.year, point.value]),
        marker: {
          symbol: symbols[index % symbols.length],
        },
        color: chartColours[index % chartColours.length],
        custom: { areaCode: item.areaCode },
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          item.areaName,
          item.healthData.map((point) => [
            point.year,
            point.lowerCi,
            point.upperCi,
          ]),
          showConfidenceIntervalsData
        );

      return showConfidenceIntervalsData
        ? [lineSeries, confidenceIntervalSeries]
        : lineSeries;
    }
  );

  if (parentIndicatorData) {
    const groupSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Group: ${parentIndicatorData.areaName}`,
      data: parentIndicatorData.healthData.map((point) => [
        point.year,
        point.value,
      ]),
      color: GovukColours.Turquoise,
      marker: {
        symbol: 'diamond',
      },
      custom: { areaCode: parentIndicatorData.areaCode },
    };

    const groupConfidenceIntervalSeries: Highcharts.SeriesOptionsType =
      generateConfidenceIntervalSeries(
        parentIndicatorData.areaName,
        parentIndicatorData.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        showConfidenceIntervalsData,
        {
          whiskerLength: '50%',
        }
      );

    if (showConfidenceIntervalsData) {
      seriesData.unshift(groupSeries, groupConfidenceIntervalSeries);
    } else {
      seriesData.unshift(groupSeries);
    }
  }

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: GovukColours.DarkGrey,
      marker: {
        symbol: 'circle',
      },
      custom: { areaCode: benchmarkData.areaCode },
    };

    const benchmarkConfidenceIntervalSeries: Highcharts.SeriesOptionsType =
      generateConfidenceIntervalSeries(
        benchmarkData.areaName,
        benchmarkData.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        showConfidenceIntervalsData,
        {
          whiskerLength: '50%',
        }
      );

    if (showConfidenceIntervalsData) {
      seriesData.unshift(englandSeries, benchmarkConfidenceIntervalSeries);
    } else {
      seriesData.unshift(englandSeries);
    }
  }

  return seriesData;
}

export function generateStandardLineChartOptions(
  healthIndicatorData: HealthDataForArea[],
  lineChartCI: boolean,
  optionalParams?: {
    benchmarkData?: HealthDataForArea;
    groupIndicatorData?: HealthDataForArea;
    yAxisTitle?: string;
    xAxisTitle?: string;
    measurementUnit?: string;
    accessibilityLabel?: string;
    colours?: ChartColours[];
    symbols?: SymbolKeyValue[];
    yAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
    xAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
    benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  }
): Highcharts.Options {
  const sortedHealthIndicatorData =
    sortHealthDataForAreasByDate(healthIndicatorData);

  const sortedBenchMarkData = optionalParams?.benchmarkData
    ? sortHealthDataForAreaByDate(optionalParams?.benchmarkData)
    : undefined;

  const sortedGroupData = optionalParams?.groupIndicatorData
    ? sortHealthDataForAreaByDate(optionalParams?.groupIndicatorData)
    : undefined;

  let seriesData = generateSeriesData(
    sortedHealthIndicatorData,
    optionalParams?.symbols ?? chartSymbols,
    optionalParams?.colours ?? chartColours,
    sortedBenchMarkData,
    sortedGroupData,
    lineChartCI
  );

  if (sortedBenchMarkData && sortedHealthIndicatorData.length === 0) {
    seriesData = generateSeriesData(
      [sortedBenchMarkData],
      ['circle'],
      [GovukColours.DarkGrey],
      undefined,
      undefined,
      lineChartCI
    );
  }

  const getBenchmarkOutcomeForYear = (
    year: number,
    areaCode: string,
    chartData: HealthDataForArea[]
  ) => {
    return chartData
      .find((healthData) => healthData.areaCode === areaCode)
      ?.healthData.find((point) => point.year === year)?.benchmarkComparison
      ?.outcome;
  };

  const generateTooltipData = (
    indicatorData: HealthDataForArea[],
    groupData?: HealthDataForArea,
    benchmarkData?: HealthDataForArea
  ): HealthDataForArea[] => {
    const tooltipData = [...indicatorData];

    if (groupData)
      tooltipData.push({
        ...groupData,
      });

    if (benchmarkData)
      tooltipData.push({
        ...benchmarkData,
      });

    return tooltipData;
  };

  const tooltipData = generateTooltipData(
    sortedHealthIndicatorData,
    sortedGroupData,
    sortedBenchMarkData
  );

  const generateAreaLineChartTooltipForPoint = (
    point: Highcharts.Point,
    symbol: string
  ) => {
    const areaCode: string = point.series.options.custom?.areaCode ?? '';

    const label =
      areaCode === areaCodeForEngland
        ? AreaTypeLabelEnum.Benchmark
        : AreaTypeLabelEnum.Area;

    const { benchmarkLabel, category, comparisonLabel } = getTooltipContent(
      getBenchmarkOutcomeForYear(point.x, areaCode, tooltipData) ??
        BenchmarkOutcome.NotCompared,
      label,
      optionalParams?.benchmarkComparisonMethod ??
        BenchmarkComparisonMethod.Unknown
    );

    const formatValueUnit = (valueUnit?: string) => {
      switch (valueUnit) {
        case undefined:
          return '';
        case '%':
          return valueUnit;
        default:
          return ` ${valueUnit}`;
      }
    };

    return [
      `<div style="padding-right: 25px">`,
      `<span style="font-weight: bold">${category}${point.series.name}</span><br/>`,
      `<span>${point.x}</span><br/>`,
      `<div style="display: flex; margin-top: 15px; align-items: center;">`,
      `<div style="margin-right: 10px;"><span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
      `<div style="padding-right: 10px;"><span>${formatNumber(point.y)}${formatValueUnit(optionalParams?.measurementUnit)}</span><br/>`,
      `${!benchmarkLabel ? '' : '<span>' + benchmarkLabel + '</span><br/>'}`,
      `${!comparisonLabel ? '' : '<span>' + comparisonLabel + '</span><br/>'}`,
      `</div>`,
      `</div>`,
      `</div>`,
    ];
  };

  return {
    ...lineChartDefaultOptions,
    yAxis: {
      ...lineChartDefaultOptions.yAxis,
      labels: {
        ...(lineChartDefaultOptions.yAxis as Highcharts.YAxisOptions)?.labels,
        formatter: optionalParams?.yAxisLabelFormatter,
      },
      title: optionalParams?.yAxisTitle
        ? {
            text: optionalParams?.yAxisTitle,
            margin: 20,
            style: { fontSize: AXIS_TITLE_FONT_SIZE },
          }
        : undefined,
    },
    xAxis: {
      ...lineChartDefaultOptions.xAxis,
      title: {
        text: optionalParams?.xAxisTitle,
        margin: 20,
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
      labels: {
        ...(lineChartDefaultOptions.yAxis as Highcharts.XAxisOptions)?.labels,
        formatter: optionalParams?.xAxisLabelFormatter,
      },
    },
    series: seriesData,
    tooltip: {
      headerFormat: '',
      formatter: function (this: Highcharts.Point): string {
        return pointFormatterHelper(this, generateAreaLineChartTooltipForPoint);
      },
      useHTML: true,
    },
    accessibility: {
      ...lineChartDefaultOptions.accessibility,
      description: optionalParams?.accessibilityLabel,
    },
  };
}
