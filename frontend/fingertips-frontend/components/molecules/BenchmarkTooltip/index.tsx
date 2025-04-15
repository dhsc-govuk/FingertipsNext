import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';

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
    <div style={{ width: 185, fontSize: '16px' }}>
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
    </div>
  );
}
