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
  indicatorDataForBenchmark?: HealthDataForArea;
  indicatorDataForGroup?: HealthDataForArea;
}

export function BenchmarkTooltip({
  indicatorDataForArea,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkArea,
  indicatorDataForBenchmark,
  indicatorDataForGroup,
}: Readonly<BenchmarkTooltipProps>) {
  return (
    <>
      {indicatorDataForBenchmark ? (
        <BenchmarkTooltipArea
          indicatorDataForArea={indicatorDataForBenchmark}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          polarity={polarity}
          measurementUnit={measurementUnit}
          benchmarkArea={benchmarkArea}
        />
      ) : null}
      {indicatorDataForGroup ? (
        <BenchmarkTooltipArea
          indicatorDataForArea={indicatorDataForGroup}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          polarity={polarity}
          measurementUnit={measurementUnit}
          benchmarkArea={benchmarkArea}
        />
      ) : null}
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
