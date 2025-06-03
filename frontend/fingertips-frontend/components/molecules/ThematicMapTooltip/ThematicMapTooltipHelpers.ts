import { TooltipType } from '@/components/atoms/BenchmarkTooltipArea';
import {
  HealthDataPoint,
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

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
  benchmarkComparisonMethod: BenchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  benchmarkOutcome: BenchmarkOutcome | undefined,
  benchmarkAreaName?: string // TODO: handle undefined case
) {
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );

  let comparisonText = getComparisonText(
    benchmarkOutcome,
    benchmarkComparisonMethod,
    benchmarkAreaName
  );
  if (
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
      return `No data available`;
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

export function getAreaMarkerSymbol(
  mostRecentDataPoint: HealthDataPoint,
  benchmarkComparisonMethod: string
) {
  return () => {
    switch (true) {
      case !mostRecentDataPoint?.benchmarkComparison?.outcome:
        return SymbolsEnum.MultiplicationX;
      case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
      case mostRecentDataPoint.benchmarkComparison?.outcome ===
        BenchmarkOutcome.NotCompared:
        return SymbolsEnum.WhiteCircle;
      default:
        return SymbolsEnum.Circle;
    }
  };
}
