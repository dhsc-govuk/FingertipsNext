import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from './chartHelpers';
import { GovukColours } from '../styleHelpers/colours';
import { symbolEncoder } from './pointFormatterHelper';

interface IBenchmarkToolTip {
  point: any;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit: string | undefined;
  benchmarkArea: string;
  benchmarkConfidenceLimitLabel: string | null;
  // Indicator?: TODO: add this to support heatmap tooltip?
}

function getComparisionString(point: any, benchmarkArea: string) {
  let comparisonString = `<span style="display:block">${point.benchmarkComparisonOutcome}`;
  if (
    point.benchmarkComparisonOutcome === BenchmarkOutcome.NotCompared ||
    point.benchmarkComparisonOutcome === BenchmarkOutcome.Similar
  ) {
    return (comparisonString += ` to ${benchmarkArea}</span>`);
  }

  return (comparisonString += ` than ${benchmarkArea}</span>`);
}

// benchmark tooltip for area
export function generateBenchmarkTooltipForArea({
  point,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkArea,
  benchmarkConfidenceLimitLabel,
}: IBenchmarkToolTip): string {
  const areaMarkerSymbol =
    (point.benchmarkComparisonOutcome as BenchmarkOutcome) ===
    BenchmarkOutcome.NotCompared
      ? symbolEncoder.multiplicationX
      : symbolEncoder.circle;

  // <div style="display: flex; align-items: center; gap: 0.25em;">${symbolItem} ${value}${measurementUnit}</div>
  // <div>${benchmarkLabel}</div>
  // <div>${comparisonLabel}</div>`,

  let tooltipString =
    `<div style="font-weight: bold">${point.areaName}</div>` +
    `<div>${point.year}</div>` +
    `<div style="display: flex; align-items: left; gap: 0.25em;">` +
    `<div style="color: ${
      getBenchmarkColour(
        benchmarkComparisonMethod,
        point.benchmarkComparisonOutcome,
        polarity
      ) ?? GovukColours.Black
    }; display: flex; align-items: center; gap: 0.25em; font-size: large;">${areaMarkerSymbol}</div>` +
    `<div>` +
    `<span style="display:block;">${point.value} ${measurementUnit}</span>`; // TODO: apply formatWholeNumber when DHSCFT-472 merges in
  tooltipString += getComparisionString(point, benchmarkArea);
  if (benchmarkConfidenceLimitLabel !== null) {
    tooltipString += `<span style="display:block;">(${benchmarkConfidenceLimitLabel})</span>`;
  }

  tooltipString += `</div></div>`;
  return tooltipString;
}

// benchmark tooltip for group

// benchmark tooltip for bechmark area (i.e. England)
