import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  indicatorDataForBenchmark?: HealthDataForArea;
  indicatorDataForGroup?: HealthDataForArea;
}

export function BenchmarkTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForBenchmark,
  indicatorDataForGroup,
}: Readonly<BenchmarkTooltipProps>) {
  return (
    <>
      {indicatorDataForBenchmark ? (
        <BenchmarkTooltipArea
          indicatorData={indicatorDataForBenchmark}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          measurementUnit={measurementUnit}
          tooltipType={'benchmark'}
        />
      ) : null}
      {indicatorDataForGroup ? (
        <BenchmarkTooltipArea
          indicatorData={indicatorDataForGroup}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          measurementUnit={measurementUnit}
          tooltipType={'group'}
        />
      ) : null}
      <BenchmarkTooltipArea
        indicatorData={indicatorData}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        measurementUnit={measurementUnit}
        tooltipType={'area'}
      />
    </>
  );
}
