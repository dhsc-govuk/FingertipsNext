import {
  IndicatorPolarity,
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SpineChartProps } from '../SpineChart/SpineChart';
import { orderStatistics } from './orderStatistics';
import { formatBarHover, formatSymbolHover } from './hoverFormatters';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const markerLineWidth = 1;

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

export function generateSeriesData({
  name,
  period,
  units,
  benchmarkName,
  benchmarkValue,
  quartileData,
  areaOneValue,
  areaOneOutcome,
  areaTwoValue,
  areaTwoOutcome,
  areaNames,
  alternativeBenchmarkValue,
  alternativeBenchmarkName,
  alternativeBenchmarkOutcome,
  benchmarkMethod,
  benchmarkToUse,
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
        benchmarkName,
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
        benchmarkName,
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
        benchmarkName,
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
        benchmarkName,
      }),
      pointWidth: 30,
      color: GovukColours.LightGrey,
      data: [scaledSecondQuartileBar],
    },
  ];

  const inverter =
    quartileData.polarity === IndicatorPolarity.LowIsGood ? -1 : 1;

  if (alternativeBenchmarkValue !== undefined) {
    const absBenchmarkValue =
      inverter *
      (Math.abs(alternativeBenchmarkValue) - Math.abs(benchmarkValue));
    const scaledGroup = absBenchmarkValue / maxDiffFromBenchmark;

    const fillColor =
      getBenchmarkColour(
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
        alternativeBenchmarkOutcome ?? BenchmarkOutcome.NotCompared,
        quartileData.polarity ?? IndicatorPolarity.NoJudgement
      ) ?? GovukColours.White;

    if (benchmarkToUse === areaCodeForEngland) {
      seriesData.push({
        type: 'scatter',
        name: formatSymbolHover({
          title: `Group: ${alternativeBenchmarkName}`,
          period: period,
          benchmarkComparisonMethod:
            benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
          value: alternativeBenchmarkValue,
          units: units,
          outcome: alternativeBenchmarkOutcome ?? 'Not compared',
          colour: fillColor,
          shape: SymbolsEnum.Diamond,
          indicatorName: name,
          benchmarkName,
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
        benchmarkName,
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

  seriesData.push({
    type: 'scatter',
    name: formatSymbolHover({
      title: `Benchmark: ${benchmarkName}`,
      period: period,
      benchmarkComparisonMethod:
        benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
      value: benchmarkValue,
      units: units,
      colour: GovukColours.Black,
      shape: SymbolsEnum.PlotLine,
      indicatorName: name,
      benchmarkName,
    }),
    marker: {
      fillColor: GovukColours.Black,
      enabled: false,
      radius: 1,
    },
    data: [0],
  });

  return seriesData;
}
