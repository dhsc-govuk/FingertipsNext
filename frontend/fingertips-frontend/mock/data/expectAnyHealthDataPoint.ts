import { expectAnyHealthPointInequality } from '@/mock/data/expectAnyHealthPointInequality';
import { expectAnyHealthPointBenchmark } from '@/mock/data/expectAnyHealthPointBenchmark';
import { expectAnyHealthPointDeprivation } from '@/mock/data/expectAnyHealthPointDeprivation';
import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const expectAnyHealthDataPoint = (
  overrides?: Partial<HealthDataPoint>
) => ({
  year: expect.any(Number),
  count: expect.any(Number),
  value: expect.any(Number),
  lowerCi: expect.any(Number),
  upperCi: expect.any(Number),
  ageBand: expectAnyHealthPointInequality(),
  sex: expectAnyHealthPointInequality(),
  trend: expect.any(String),
  isAggregate: expect.any(Boolean),
  benchmarkComparison: expectAnyHealthPointBenchmark(),
  deprivation: expectAnyHealthPointDeprivation(),
  ...overrides,
});
