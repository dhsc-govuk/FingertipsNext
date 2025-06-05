import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

export type TooltipType = 'area' | 'benchmark' | 'comparator';

export function getAreaTitle(areaName: string, tooltipType: TooltipType) {
  switch (tooltipType) {
    case 'benchmark':
      return `Benchmark: ${areaName}`;
    case 'comparator':
      return areaName !== 'England' ? `Group: ${areaName}` : areaName;
    default:
      return areaName;
  }
}

export function getComparisonString(
  benchmarkOutcome: BenchmarkOutcome | undefined,
  tooltipType: TooltipType,
  benchmarkAreaName?: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown
) {
  if (tooltipType === 'benchmark') return;
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );

  let comparisonText = getComparisonText(
    benchmarkOutcome,
    benchmarkComparisonMethod,
    benchmarkAreaName
  );
  if (
    comparisonText &&
    benchmarkConfidenceLimit &&
    // && benchmarkAreaName !== 'England'
    benchmarkOutcome !== BenchmarkOutcome.NotCompared
  ) {
    comparisonText += ` (${benchmarkConfidenceLimit}%)`;
  }

  return comparisonText;
  // <>
  //   <span style={{ display: 'block' }}>{comparisonText()}</span>
  //   {benchmarkConfidenceLimit && benchmarkArea !== 'England' ? (
  //     <span style={{ display: 'block' }}>({benchmarkConfidenceLimit}%)</span>
  //   ) : null}
  // </>
}

function getComparisonText(
  benchmarkOutcome?: BenchmarkOutcome,
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  benchmarkArea?: string
) {
  switch (true) {
    case !benchmarkOutcome:
      return '';
    case benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles:
      return `${benchmarkOutcome} quintile`;
    case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
    case benchmarkOutcome === BenchmarkOutcome.NotCompared:
      return `Not compared`;
    case benchmarkOutcome === BenchmarkOutcome.Similar:
      return `${benchmarkOutcome} to ${benchmarkArea}`;
    default:
      return `${benchmarkOutcome} than ${benchmarkArea}`;
  }
}

export function getBenchmarkSymbol(
  outcome: BenchmarkOutcome | undefined,
  benchmarkComparisonMethod: BenchmarkComparisonMethod
): SymbolsEnum {
  switch (true) {
    case !outcome:
      return SymbolsEnum.MultiplicationX;
    case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
    case outcome === BenchmarkOutcome.NotCompared:
      return SymbolsEnum.WhiteCircle;
    case benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles:
      return SymbolsEnum.Diamond;
    default:
      return SymbolsEnum.Circle;
  }
}

export function getValueString(
  value: number | BenchmarkOutcome | undefined,
  measurementUnit?: string
): string | undefined {
  switch (true) {
    case value === undefined:
      return 'No data available';
    case typeof value === 'number':
      return measurementUnit
        ? `${formatNumber(value)} ${measurementUnit}`
        : `${formatNumber(value)}`;
    case value === BenchmarkOutcome.NotCompared:
      return 'Not compared';
    default:
      return value;
  }
}
