import Highcharts from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { SpineChartProps } from '.';
import { formatNumber } from '@/lib/numberFormatter';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

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

interface FormatBarHoverProps {
  period: number;
  lowerName: string;
  lowerValue: number;
  upperName: string;
  upperValue: number;
  units: string;
  colour: string;
  indicatorName: string;
}

interface FormatSymbolHoverProps {
  title: string;
  period: number;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  value: number;
  units: string;
  outcome: string;
  colour: string;
  shape: SymbolsEnum;
  indicatorName: string;
}

function formatSymbol(colour: string, shape: SymbolsEnum) {
  return `<span style="color:${colour}; font-size:19px;">${shape}</span>`;
}

function formatTitleBlock(
  title: string,
  period: number,
  indicatorName: string
) {
  return `<div style="min-width: 100px; font-size: 16px;">
        <h4 style="margin:0px; padding:0px;">
          ${title}
        </h4>
        <span style="display: block;">${period}</span>
        <span style="display: block;">${indicatorName}</span>`;
}

function formatBarHover(props: FormatBarHoverProps) {
  return `${formatTitleBlock('Benchmark: England', props.period, props.indicatorName)}
            <div style="padding:0px; margin:0px;">
                <div style="display:flex; 
                  flex-direction:row;
                  align-items: center;
                  flex-wrap:nowrap;
                  justify-content: flex-start;
                  ">
                  <span style="color:${props.colour}; font-size:19px;">${SymbolsEnum.Square}</span> 
                  <div style="flex-grow:2; padding:0.5em;">
                    <span style="display: block;">${formatNumber(props.lowerValue)}${formatUnits(props.units)} to ${formatNumber(props.upperValue)}${formatUnits(props.units)}</span>
                    <span style="display: block;">${props.lowerName} to ${props.upperName}</span>
                  </div>
              </div>
            <div>
          <div>`;
}

function formatSymbolHover(props: FormatSymbolHoverProps) {
  return `${formatTitleBlock(props.title, props.period, props.indicatorName)}
            <div style="padding:0px; margin:0px;">
                <div style="display:flex; 
                  flex-direction:row;
                  align-items: center;
                  flex-wrap:nowrap;
                  justify-content: flex-start;
                  ">
                  ${formatSymbol(props.colour, props.shape)} 
                  <div style="flex-grow:2; 
                    padding:0.5em;
                    ">
                    <span style="display: block;">${formatNumber(props.value)}${formatUnits(props.units)}</span>
                    ${
                      props.outcome === 'Not compared'
                        ? '<span style="display: block;">Not compared</span>'
                        : `<span style="display: block;">${props.outcome} than England</span>
                         <span style="display: block;">${benchmarkComparisonMethodToString(props.benchmarkComparisonMethod)}</span>`
                    }
                  </div>
              </div>
            <div>
          <div>`;
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
  if (
    best === undefined ||
    upperQuartile === undefined ||
    lowerQuartile === undefined ||
    worst === undefined
  ) {
    return null;
  }

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
      name: formatBarHover({
        period: period,
        lowerName: 'Worst',
        lowerValue: worst,
        upperName: '25th percentile',
        upperValue: lowerQuartile,
        units: units,
        colour: GovukColours.MidGrey,
        indicatorName: name,
      }),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [-scaledFourthQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover({
        period: period,
        upperName: 'Best',
        upperValue: best,
        lowerName: '75th percentile',
        lowerValue: upperQuartile,
        units: units,
        colour: GovukColours.MidGrey,
        indicatorName: name,
      }),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [scaledFirstQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover({
        period: period,
        lowerName: '25th percentile',
        lowerValue: lowerQuartile,
        upperName: '75th percentile',
        upperValue: upperQuartile,
        units: units,
        colour: GovukColours.LightGrey,
        indicatorName: name,
      }),
      pointWidth: 30,
      color: GovukColours.LightGrey,
      data: [-scaledThirdQuartileBar],
    },
    {
      type: 'bar',
      name: formatBarHover({
        period: period,
        lowerName: '25th percentile',
        lowerValue: lowerQuartile,
        upperName: '75th percentile',
        upperValue: upperQuartile,
        units: units,
        colour: GovukColours.LightGrey,
        indicatorName: name,
      }),
      pointWidth: 30,
      color: GovukColours.LightGrey,
      data: [scaledSecondQuartileBar],
    },
  ];

  const inverter =
    quartileData.polarity === IndicatorPolarity.LowIsGood ? -1 : 1;

  if (groupValue !== undefined) {
    const absGroupValue =
      inverter * (Math.abs(groupValue) - Math.abs(benchmarkValue));
    const scaledGroup = absGroupValue / maxDiffFromBenchmark;

    const fillColor =
      getBenchmarkColour(
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        groupOutcome ?? BenchmarkOutcome.NotCompared,
        quartileData.polarity ?? IndicatorPolarity.NoJudgement
      ) ?? GovukColours.White;

    seriesData.push({
      type: 'scatter',
      name: formatSymbolHover({
        title: `Group: ${groupName}`,
        period: period,
        benchmarkComparisonMethod:
          benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        value: groupValue,
        units: units,
        outcome: groupOutcome ?? 'Not compared',
        colour: fillColor,
        shape: SymbolsEnum.Diamond,
        indicatorName: name,
      }),
      marker: {
        symbol: 'diamond',
        radius: 8,
        fillColor: fillColor,
        lineColor: GovukColours.Black,
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

    const fillColor =
      getBenchmarkColour(
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        outcome ?? BenchmarkOutcome.NotCompared,
        quartileData.polarity ?? IndicatorPolarity.NoJudgement
      ) ?? GovukColours.White;

    const absAreaValue =
      inverter * (Math.abs(value) - Math.abs(benchmarkValue));
    const scaledArea = absAreaValue / maxDiffFromBenchmark;
    seriesData.push({
      type: 'scatter',
      name: formatSymbolHover({
        title: areaName,
        period: period,
        benchmarkComparisonMethod:
          benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        value: value,
        units: units,
        outcome: outcome ?? 'Not compared',
        colour: fillColor,
        shape: index === 0 ? SymbolsEnum.Circle : SymbolsEnum.Square,
        indicatorName: name,
      }),
      marker: {
        symbol: index === 0 ? 'circle' : 'square',
        radius: 6,
        fillColor,
        lineColor: GovukColours.Black,
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
        fillColor: GovukColours.Black,
      },
      data: [0],
    });
  }

  return seriesData;
}

export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const { quartileData, benchmarkValue } = props;
  const { q0Value, q1Value, q3Value, q4Value } = quartileData;
  if (
    q0Value === undefined ||
    q1Value === undefined ||
    q3Value === undefined ||
    q4Value === undefined ||
    benchmarkValue === undefined
  ) {
    return null;
  }

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
      enabled: false,
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
      headerFormat: ``,
      pointFormatter: function (this: Highcharts.Point) {
        return this.series.name;
      },
      useHTML: true,
      style: {
        fontSize: 16,
      },
    },
    series: generateSeriesData(props),
  };
}
