import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  indicatorDataForBenchmark?: HealthDataForArea;
  indicatorDataForGroup?: HealthDataForArea;
  polarity: IndicatorPolarity;
}

export function BenchmarkTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForBenchmark,
  indicatorDataForGroup,
  polarity,
}: Readonly<BenchmarkTooltipProps>) {
  return (
    <div style={{ width: 185, fontSize: '16px' }}>
      {indicatorDataForBenchmark ? (
        <BenchmarkTooltipArea
          indicatorData={indicatorDataForBenchmark}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          measurementUnit={measurementUnit}
          tooltipType={'benchmark'}
          polarity={polarity}
        />
      ) : null}
      {indicatorDataForGroup ? (
        <BenchmarkTooltipArea
          indicatorData={indicatorDataForGroup}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          measurementUnit={measurementUnit}
          tooltipType={'group'}
          polarity={polarity}
        />
      ) : null}
      <BenchmarkTooltipArea
        indicatorData={indicatorData}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        measurementUnit={measurementUnit}
        tooltipType={'area'}
        polarity={polarity}
      />
    </div>
  );
}
