import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const mockHealthDataPoint = (
  overrides?: Partial<HealthDataPoint>
): HealthDataPoint => ({
  year: 2023,
  count: 5195,
  value: 18.1,
  lowerCi: 17.6,
  upperCi: 18.6,
  ageBand: {
    value: 'All ages',
    isAggregate: true,
  },
  sex: {
    value: 'Persons',
    isAggregate: true,
  },
  trend: 'Cannot be calculated',
  isAggregate: true,
  benchmarkComparison: {
    outcome: 'Worse',
    benchmarkAreaCode: 'E92000001',
    benchmarkAreaName: 'England',
    benchmarkValue: 14.8,
  },
  deprivation: {
    sequence: 11,
    value: 'Persons',
    type: 'Persons',
    isAggregate: true,
  },
  ...overrides,
});
