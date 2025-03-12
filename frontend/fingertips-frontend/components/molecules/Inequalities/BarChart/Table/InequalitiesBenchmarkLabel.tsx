import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';
import React, { FC } from 'react';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';

interface InequalitiesBenchmarkLabelProps {
  comparison?: HealthDataPointBenchmarkComparison;
}

export const InequalitiesBenchmarkLabel: FC<
  InequalitiesBenchmarkLabelProps
> = ({ comparison }) => {
  if (!comparison) return null;
  const { outcome, method } = comparison;
  return <BenchmarkLabel type={outcome} group={method} />;
};
