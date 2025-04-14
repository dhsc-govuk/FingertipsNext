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
import { formatNumber } from '@/lib/numberFormatter';

const markerLineWidth = 1;

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

export const generateSpineChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [`<span style="color:${point.color}">${symbol}</span>`];

function benchmarkComparisonMethodToString(
  benchmarkComparisonMethod: BenchmarkComparisonMethod
): string {
  switch (benchmarkComparisonMethod) {
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue95:
      return '(95%)';
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8:
      return '(99.8%)';
    case BenchmarkComparisonMethod.Quintiles:
      return 'Highest quintile';
    default:
      return 'Not compared';
  }
}

function formatUnits(units: string): string {
  if (units !== '%') {
    return ' ' + units;
  }

  return units;
}

function formatBarHover(
  period: number,
  lowerName: string,
  lowerValue: number,
  upperName: string,
  upperValue: number,
  units: string
) {
  return `<div style="margin:0px; padding:0px;">
              <span style="font-weight: bold; display: block;">
              Benchmark: England
              </span>
              <span style="display: block;">${period}</span>
              <span style="display: block;">${formatNumber(lowerValue)}${formatUnits(units)} to ${formatNumber(upperValue)}${formatUnits(units)}</span></br/>
              <span style="display: block;">${lowerName} to ${upperName}</span><div>`;
}

function formatSymbolHover(
  title: string,
  period: number,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  value: number,
  units: string,
  outcome: string
) {
  return `<div style="margin:0px; padding:0px;">
              <span style="font-weight: bold; display: block;">
              ${title}
              </span>
              <span style="display: block;">${period}</span>
              <span style="display: block;">${formatNumber(value)}${formatUnits(units)}</span></br/>
              <span style="display: block;">${outcome}</span></br/>
              <span style="display: block;">${benchmarkComparisonMethodToString(benchmarkComparisonMethod)}</span>
              <div>`;
}

export function generateSeriesData({
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
  const {
    best,
    bestQuartile: upperQuartile,
    worstQuartile: lowerQuartile,
    worst,
  } = orderStatistics(quartileData);

  const maxDiffFromBenchmark = Math.max(
    absDiff(best, benchmarkValue),
    absDiff(worst, benchmarkValue)
  );

  const scaledFirstQuartileBar =
    absDiff(best, upperQuartile) / maxDiffFromBenchmark;
  const scaledSecondQuartileBar =
    absDiff(upperQuartile, benchmarkValue) / maxDiffFromBenchmark;
  const scaledThirdQuartileBar =
    absDiff(lowerQuartile, benchmarkValue) / maxDiffFromBenchmark;
  const scaledFourthQuartileBar =
    absDiff(worst, lowerQuartile) / maxDiffFromBenchmark;

  const seriesData: (
    | Highcharts.SeriesBarOptions
    | Highcharts.SeriesScatterOptions
  )[] = [
    {
      type: 'bar',
      name: formatBarHover(
        period,
        'Worst',
        worst,
        '25th percentile',
        lowerQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [-scaledFourthQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover(
        period,
        'Best',
        best,
        '75th percentile',
        upperQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [scaledFirstQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover(
        period,
        '25th percentile',
        lowerQuartile,
        '75th percentile',
        upperQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.DarkGrey,
      data: [-scaledThirdQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover(
        period,
        '25th percentile',
        lowerQuartile,
        '75th percentile',
        upperQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.DarkGrey,
      data: [scaledSecondQuartileBar],
    },
  ];

  const inverter =
    quartileData.polarity === IndicatorPolarity.LowIsGood ? -1 : 1;

  if (groupValue !== undefined) {
    const absGroupValue =
      inverter * (Math.abs(groupValue) - Math.abs(benchmarkValue));
    const scaledGroup = absGroupValue / maxDiffFromBenchmark;
    seriesData.push({
      type: 'scatter',
      name: formatSymbolHover(
        `Group: ${groupName}`,
        period,
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        groupValue,
        units,
        groupOutcome ?? 'Not compared'
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
    { value: areaOneValue, outcome: areaOneOutcome, areaName: areaNames[0] },
    { value: areaTwoValue, outcome: areaTwoOutcome, areaName: areaNames[1] },
  ];

  areas.forEach(({ value, outcome, areaName }, index) => {
    if (value === undefined) return;
    const fillColor = getBenchmarkColour(
      benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
      outcome ?? BenchmarkOutcome.NotCompared,
      quartileData.polarity ?? IndicatorPolarity.NoJudgement
    );

    const absAreaValue =
      inverter * (Math.abs(value) - Math.abs(benchmarkValue));
    const scaledArea = absAreaValue / maxDiffFromBenchmark;
    seriesData.push({
      type: 'scatter',
      name: formatSymbolHover(
        areaName,
        period,
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        value,
        units,
        outcome ?? 'Not compared'
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
export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const categories = [''];

  return {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [5, 5, 5, 5],
      height: 50,
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
    tooltip: {
      outside: true,
      padding: 10,
      headerFormat: `{series.name}`,
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, generateSpineChartTooltipForPoint);
      },
      useHTML: true,
    },
    series: generateSeriesData(props),
  };
}
