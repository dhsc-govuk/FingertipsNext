import Highcharts from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { pointFormatterHelper} from '@/lib/chartHelpers/pointFormatterHelper';
import { SpineChartProps } from '.';
import { formatNumber} from '@/lib/numberFormatter';

const markerLineWidth = 1;

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

function benchmarkComparisonMethodToString(benchmarkComparisonMethod: BenchmarkComparisonMethod):string {
  switch (benchmarkComparisonMethod) {
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue95:
      return '(95%)'
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8:
      return '(99.8%)'
    case BenchmarkComparisonMethod.Quintiles:
      return 'Highest quintile'
    default:
      return 'Not compared'
  }
}

function formatBarHover(
    title: string,
    period: number,
    indicatorName: string,
    lowerName: string,
    lowerValue: number,
    upperName: string,
    upperValue: number,
    units: string
  ) {
    return `<div style="margin:0px; padding:0px;">
              <span style="font-weight: bold; display: block;">
              ${title}
              </span>
              <span style="display: block;">${period}</span>
              <span style="display: block;">${indicatorName}</span>
              <span style="display: block; float: right;">${formatNumber(lowerValue)}${units} to ${formatNumber(upperValue)}${units}</span></br/>
              <span style="display: block; float: right;">${lowerName} to ${upperName}</span><div>`;
  }

  function formatSymbolHover(
    title: string,
    period: number,
    indicatorName: string,
    benchmarkComparisonMethod: BenchmarkComparisonMethod,
    value: number,
    units: string,
    outcome: string,
  ) {
    return `<div style="margin:0px; padding:0px;">
              <span style="font-weight: bold; display: block;">
              ${title}
              </span>
              <span style="display: block;">${period}</span>
              <span style="display: block;">${indicatorName}</span>
              <span style="display: block; float: right;">${formatNumber(value)}${units}</span></br/>
              <span style="display: block; float: right;">${outcome}</span></br/>
              <span style="display: block; float: right;">${benchmarkComparisonMethodToString(benchmarkComparisonMethod)}</span>
              <div>`;
  }

function generateSeriesData({
  name,
  period,
  units,
  benchmarkValue,
  quartileData,
  areaOneValue,
  areaOneOutcome,
  areaTwoValue,
  areaTwoOutcome,
  areaNames,
  groupValue,
  groupName,
  groupOutcome,
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

  const seriesData: (
    | Highcharts.SeriesBarOptions
    | Highcharts.SeriesScatterOptions
  )[] = [
    {
      type: 'bar',
      name: formatBarHover(
        'Benchmark: England',
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
      name: formatBarHover(
        'Benchmark: England',
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
      name: formatBarHover(
        'Benchmark: England',
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
      name: formatBarHover(
        'Benchmark: England',
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
      color: '#fff',
      name: formatSymbolHover(
        `Group: ${groupName}`,
        period,
        name,
        benchmarkMethod??BenchmarkComparisonMethod.Unknown,
        groupValue,
        units,
        groupOutcome?? 'Not compared',       
      ),
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
    { value: areaOneValue, outcome: areaOneOutcome, areaName: areaNames[0]},
    { value: areaTwoValue, outcome: areaTwoOutcome, areaName: areaNames[1]},
  ];
  areas.forEach(({ value, outcome, areaName }, index) => {
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
      name: formatSymbolHover(
        areaName,
        period,
        name,
        benchmarkMethod??BenchmarkComparisonMethod.Unknown,
        value,
        units,
        outcome?? 'Not compared',
      ),
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

const generateSpineChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [`<span style="fillColor:${point.color}; radius: 30; lineColor: '#000'; lineWidth: ${markerLineWidth};">${symbol}</span>`];

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
