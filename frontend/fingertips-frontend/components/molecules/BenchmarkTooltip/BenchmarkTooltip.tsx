import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface BenchmarkTooltipProps {
  indicatorDataForArea: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit: string | undefined;
  benchmarkArea: string;
  // indicatorDataForBenchmark: HealthDataForArea
  // indicatorDataForGroup: HealthDataForArea
}

export function BenchmarkTooltip({
  indicatorDataForArea,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkArea,
}: Readonly<BenchmarkTooltipProps>) {
  return (
    <>
      {/* Add Benchmark if required */}
      {/* Add Group if required */}
      <BenchmarkTooltipArea
        indicatorDataForArea={indicatorDataForArea}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        measurementUnit={measurementUnit}
        benchmarkArea={benchmarkArea}
      />
    </>
  );
}
