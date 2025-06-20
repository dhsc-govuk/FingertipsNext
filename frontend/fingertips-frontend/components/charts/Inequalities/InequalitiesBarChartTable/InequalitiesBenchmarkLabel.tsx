import {
  BenchmarkComparisonMethod,
  HealthDataPointBenchmarkComparison,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import React, { FC } from 'react';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';

interface InequalitiesBenchmarkLabelProps {
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  comparison?: HealthDataPointBenchmarkComparison;
  polarity?: IndicatorPolarity;
}

export const InequalitiesBenchmarkLabel: FC<
  InequalitiesBenchmarkLabelProps
> = ({
  comparison,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}) => {
  if (!comparison) return null;
  const { outcome } = comparison;
  return (
    <BenchmarkLabel
      outcome={outcome}
      method={benchmarkComparisonMethod}
      polarity={polarity}
    />
  );
};
