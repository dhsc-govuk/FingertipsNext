import { TooltipType } from '@/components/atoms/BenchmarkTooltipArea';
import {
  HealthDataPoint,
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

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
export function getAreaTitle(areaName: string, tooltipType: TooltipType) {
  switch (tooltipType) {
    case 'benchmark':
      return `Benchmark: ${areaName}`;
    case 'group':
      return areaName !== 'England' ? `Group: ${areaName}` : areaName;
    default:
      return areaName;
  }
}

export function getComparisonString(
  benchmarkArea: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  benchmarkOutcome?: BenchmarkOutcome
) {
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );

  const comparisonText = () => {
    switch (true) {
      case !benchmarkOutcome:
        // return null;
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
  };

  return `${comparisonText()} (${benchmarkConfidenceLimit}%)`;
  // <>
  //   <span style={{ display: 'block' }}>{comparisonText()}</span>
  //   {benchmarkConfidenceLimit && benchmarkArea !== 'England' ? (
  //     <span style={{ display: 'block' }}>({benchmarkConfidenceLimit}%)</span>
  //   ) : null}
  // </>
}
