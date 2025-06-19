import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';

export const expectAnyHealthPointBenchmark = (
  overrides?: Partial<HealthDataPointBenchmarkComparison>
) => ({
  outcome: expect.any(String),
  benchmarkAreaCode: expect.any(String),
  benchmarkAreaName: expect.any(String),
  benchmarkValue: expect.any(Number),
  ...overrides,
});
