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
  let comparisonString = `<br /><span>${point.benchmarkComparisonOutcome}`;
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

  let tooltipString =
    `<br /><span style="font-weight: bold">${point.areaName}</span>` +
    `<br /><span>${point.year}</span>` +
    `<br /><span style="color: ${
      getBenchmarkColour(
        benchmarkComparisonMethod,
        point.benchmarkComparisonOutcome,
        polarity
      ) ?? GovukColours.Black
    }; font-size: large;">${areaMarkerSymbol}</span>` +
    `<span>${point.value} ${measurementUnit}</span>`; // TODO: apply formatWholeNumber when DHSCFT-472 merges in
  tooltipString += getComparisionString(point, benchmarkArea);
  if (benchmarkConfidenceLimitLabel !== null) {
    tooltipString += `<br /><span>(${benchmarkConfidenceLimitLabel})</span>`;
  }

  return tooltipString;
}

// benchmark tooltip for group

// benchmark tooltip for bechmark area (i.e. England)
