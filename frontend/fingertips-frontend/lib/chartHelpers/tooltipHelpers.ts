import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from './chartHelpers';
import { GovukColours } from '../styleHelpers/colours';
import { symbolEncoder } from './pointFormatterHelper';

// benchmark tooltip for area
export function generateBenchmarkTooltipForArea(
  point: any,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity,
  measurementUnit: string | undefined,
  benchmarkArea: string,
  benchmarkConfidenceLimitLabel: string | null
) {
  const areaMarkerSymbol =
    (point.benchmarkComparisonOutcome as BenchmarkOutcome) ===
    BenchmarkOutcome.NotCompared
      ? symbolEncoder.multiplicationX
      : symbolEncoder.circle;

  const tooltipString =
    `<br /><span style="font-weight: bold">${point.areaName}</span>` +
    `<br /><span>${point.year}</span>` +
    `<br /><span style="color: ${
      getBenchmarkColour(
        benchmarkComparisonMethod,
        point.benchmarkComparisonOutcome,
        polarity
      ) ?? GovukColours.Black
    }; font-size: large;">${areaMarkerSymbol}</span>` +
    `<span>${point.value} ${measurementUnit}</span>` +
    `<br /><span>${point.benchmarkComparisonOutcome} than ${benchmarkArea}</span>` +
    `<br /><span>(${benchmarkConfidenceLimitLabel})</span>`;
  return tooltipString;
}

// benchmark tooltip for group

// benchmark tooltip for bechmark area (i.e. England)
