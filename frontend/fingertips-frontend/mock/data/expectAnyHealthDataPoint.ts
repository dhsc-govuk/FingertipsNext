import { expectAnyHealthPointInequality } from '@/mock/data/expectAnyHealthPointInequality';
import { expectAnyHealthPointBenchmark } from '@/mock/data/expectAnyHealthPointBenchmark';
import { expectAnyHealthPointDeprivation } from '@/mock/data/expectAnyHealthPointDeprivation';
import { DatePeriod, HealthDataPoint } from '@/generated-sources/ft-api-client';

export const expectAnyDatePeriod = (overrides?: Partial<DatePeriod>) => ({
  type: expect.any(String),
  from: expect.any(Date),
  to: expect.any(Date),
  ...overrides,
});

export const expectAnyHealthDataPoint = (
  overrides?: Partial<HealthDataPoint>
) => ({
  year: expect.any(Number),
  datePeriod: expectAnyDatePeriod(),
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
