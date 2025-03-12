import { BenchmarkLabelType } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  HealthDataPointBenchmarkComparisonIndicatorPolarityEnum,
} from '@/generated-sources/ft-api-client';

export const getBenchmarkType = (
  areaOfInterestLowerConfidence: number,
  areaOfInterestUpperConfidence: number,
  benchmarkValue: number,
  comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum,
  polarity?: HealthDataPointBenchmarkComparisonIndicatorPolarityEnum
): BenchmarkLabelType => {
  const comparisonValue = getComparisonValue(
    areaOfInterestLowerConfidence,
    areaOfInterestUpperConfidence,

    benchmarkValue
  );

  return getComparisonBenchmarkType(
    comparisonValue,
    comparisonMethod,
    polarity
  );
};

const getComparisonValue = (
  areaOfInterestLowerConfidence: number,
  areaOfInterestUpperConfidence: number,

  benchmarkValue: number
): -1 | 0 | 1 => {
  if (areaOfInterestUpperConfidence < benchmarkValue) return -1;
  if (areaOfInterestLowerConfidence > benchmarkValue) return 1;
  return 0;
};

const getComparisonBenchmarkType = (
  comparisonValue: -1 | 0 | 1,
  comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum,
  polarity?: HealthDataPointBenchmarkComparisonIndicatorPolarityEnum
) => {
  const comparisonValueAfterPolarity =
    comparisonValue *
    (polarity ===
    HealthDataPointBenchmarkComparisonIndicatorPolarityEnum.LowIsGood
      ? -1
      : 1);

  if (
    comparisonMethod === GetHealthDataForAnIndicatorComparisonMethodEnum.Rag
  ) {
    switch (comparisonValueAfterPolarity) {
      case -1:
        return BenchmarkLabelType.WORSE;
      case 1:
        return BenchmarkLabelType.BETTER;
      default:
        return BenchmarkLabelType.SIMILAR;
    }
  }

  switch (comparisonValueAfterPolarity) {
    case -1:
      return BenchmarkLabelType.LOWER;
    case 1:
      return BenchmarkLabelType.HIGHER;
    default:
      return BenchmarkLabelType.SIMILAR;
  }
};
