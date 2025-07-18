import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { mockDeprivationData } from '@/mock/data/mockDeprivationData';
import { mockDatePeriod } from './mockDatePeriod';

export const mockHealthDataPoint = (
  overrides?: Partial<HealthDataPoint>
): HealthDataPoint => ({
  year: 2023,
  datePeriod: mockDatePeriod(),
  count: 5195,
  value: 18.1,
  lowerCi: 17.6,
  upperCi: 18.6,
  ageBand: {
    value: 'All ages',
    isAggregate: true,
  },
  sex: {
    // deprecated
    value: 'deprecated',
    isAggregate: false,
  },
  trend: 'Cannot be calculated',
  isAggregate: true,
  benchmarkComparison: {
    outcome: 'Worse',
    benchmarkAreaCode: 'E92000001',
    benchmarkAreaName: 'England',
    benchmarkValue: 14.8,
  },
  deprivation: mockDeprivationData(),
  ...overrides,
});

export const mockHealthDataPoints = (
  manyOverrides: (Partial<HealthDataPoint> | number | undefined)[]
) => {
  return manyOverrides.map((overrides) => {
    if (overrides == undefined || typeof overrides === 'number') {
      return mockHealthDataPoint({
        year: overrides,
        value: overrides,
        datePeriod: mockDatePeriod(overrides),
      });
    }

    const override: Partial<HealthDataPoint> = {
      ...overrides,
      datePeriod: mockDatePeriod(overrides.year),
    };

    return mockHealthDataPoint(override);
  });
};
