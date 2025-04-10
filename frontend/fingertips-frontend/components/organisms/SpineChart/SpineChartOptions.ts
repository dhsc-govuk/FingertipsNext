import Highcharts from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { SpineChartProps } from '.';

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

function formatHeader(
    period: number, 
    indicatorName: string, 
    lowerName: string,
    lowerValue: number,
    upperName: string,
    upperValue: number,
    units: string) {
    return `<div style="margin:0px; padding:0px;">
            <span style="font-weight: bold; display: block;">
            Benchmark: England
            </span>
            <span style="display: block;">${period}</span>
            <span style="display: block;">${indicatorName}</span>
            <span style="display: block; float: right;">${lowerValue}${units} to ${upperValue}${units}</span></br/>
            <span style="display: block; float: right;">${lowerName} to ${upperName}</span><div>`
}

export function generateSeriesData({
  name,
  period,
  units,
  benchmarkValue,
  quartileData,
  areaOneValue,
  areaOneOutcome,
  areaTwoValue,
  areaTwoOutcome,
  groupValue,
  benchmarkMethod,
}: Readonly<SpineChartProps>) {
  const { best, bestQuartile, worstQuartile, worst } =
    orderStatistics(quartileData);

  const absBest = absDiff(best, benchmarkValue);
  const absWorst = absDiff(worst, benchmarkValue);
  const absBestQuartile = absDiff(bestQuartile, benchmarkValue);
  const absWorstQuartile = absDiff(worstQuartile, benchmarkValue);

  const maxValue = Math.max(absBest, absWorst);

  const scaledBest = absBest / maxValue;
  const scaledWorst = absWorst / maxValue;
  const scaledBestQuartile = absBestQuartile / maxValue;
  const scaledWorstQuartile = absWorstQuartile / maxValue;

  const markerLineWidth = 1;

  const seriesData: (
    | Highcharts.SeriesBarOptions
    | Highcharts.SeriesScatterOptions
  )[] = [
    {
      type: 'bar',
      name: formatHeader(
        period,
        name,
        'Worst',
        worst,
        '25th percentile',
        worstQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [-scaledWorst + scaledWorstQuartile],
    },
    {
      type: 'bar',
      name: formatHeader(
        period,
        name,
        'Best',
        best,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [scaledBest - scaledBestQuartile],
    },
    {
      type: 'bar',
      name: formatHeader(
        period,
        name,
        '25th percentile',
        worstQuartile,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.DarkGrey,
      data: [-scaledWorstQuartile],
    },
    {
      type: 'bar',
      name: formatHeader(
        period,
        name,
        '25th percentile',
        worstQuartile,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.DarkGrey,
      data: [scaledBestQuartile],
    },
  ];

  const flipper =
    quartileData.polarity === IndicatorPolarity.LowIsGood ? -1 : 1;

  if (groupValue !== undefined) {
    const absGroupValue =
      flipper * (Math.abs(groupValue) - Math.abs(benchmarkValue));
    const scaledGroup = absGroupValue / maxValue;
    seriesData.push({
      type: 'scatter',
      name: 'Group',
      marker: {
        symbol: 'diamond',
        radius: 8,
        fillColor: '#fff',
        lineColor: '#000',
        lineWidth: markerLineWidth,
      },
      data: [scaledGroup],
    });
  }

  const areas = [
    { value: areaOneValue, outcome: areaOneOutcome },
    { value: areaTwoValue, outcome: areaTwoOutcome },
  ];
  areas.forEach(({ value, outcome }, index) => {
    if (value === undefined) return;
    const fillColor = getBenchmarkColour(
      benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
      outcome ?? BenchmarkOutcome.NotCompared,
      quartileData.polarity ?? IndicatorPolarity.NoJudgement
    );

    const absAreaValue = flipper * (Math.abs(value) - Math.abs(benchmarkValue));
    const scaledArea = absAreaValue / maxValue;
    seriesData.push({
      type: 'scatter',
      name: `Area ${outcome}`,
      marker: {
        symbol: index === 0 ? 'circle' : 'square',
        radius: 6,
        fillColor,
        lineColor: '#000',
        lineWidth: markerLineWidth,
      },
      data: [scaledArea],
    });
  });

  if (benchmarkValue !== undefined) {
    seriesData.push({
      type: 'scatter',
      name: 'Benchmark',
      visible: false,
      marker: {
        symbol: 'circle',
        radius: 2,
        fillColor: '#000',
      },
      data: [0],
    });
  }

  return seriesData;
}

export const generateSpineChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<span style="color:${point.color}">${symbol}</span>`
];

export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const categories = [''];

  return {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [5, 5, 5, 5],
      height: 130,
      width: 400,
      inverted: true,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    title: {
      text: '',
    },
    accessibility: {
      point: {
        enabled: false,
      },
    },
    xAxis: [
      {
        categories: categories,
        visible: false,
        reversed: false,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          enabled: false,
        },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        visible: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          enabled: false,
        },
      },
    ],
    yAxis: {
      min: -1,
      max: 1,
      gridLineWidth: 0,
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
    },

    plotOptions: {
      bar: {
        stacking: 'normal',
        borderWidth: 0,
      },
    },
    series: generateSeriesData(props),
    tooltip: {
      padding: 10,
      headerFormat: `{series.name}`,
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, generateSpineChartTooltipForPoint);
      },
      useHTML: true,
    },
  };
}