import {
  DatePeriod,
  HealthDataPoint,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { mockDeprivationData } from '@/mock/data/mockDeprivationData';

export const mockHealthDataPoint = (
  overrides?: Partial<HealthDataPoint>
): HealthDataPoint => ({
  year: 2023,
  datePeriod: {
    type: PeriodType.Calendar,
    from: new Date('2023-01-01'),
    to: new Date('2023-12-31'),
  },
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

export const mockDatePeriod = (
  overrides: Partial<DatePeriod> | number | undefined
) => {
  if (overrides === undefined || typeof overrides === 'number') {
    const year = overrides ? overrides : 2023;
    return {
      type: PeriodType.Calendar,
      from: new Date(`${year}-01-01`),
      to: new Date(`${year}-12-31`),
    };
  }
  return {
    type: PeriodType.Calendar,
    from: new Date('2023-01-01'),
    to: new Date('2023-12-31'),
    ...overrides,
  };
};

export const mockHealthDataPoints = (
  manyOverrides: (Partial<HealthDataPoint> | number | undefined)[]
) =>
  manyOverrides.map((overrides) => {
    if (overrides === undefined || typeof overrides === 'number') {
      return mockHealthDataPoint({ year: overrides, value: overrides });
    }

    return mockHealthDataPoint(overrides);
  });

export const mockHealthDataPointsNew = (
  manyOverrides: (Partial<HealthDataPoint> | number | undefined | DatePeriod)[]
) =>
  manyOverrides.map((overrides) => {
    if (overrides === undefined || typeof overrides === 'number') {
      return mockHealthDataPoint({
        year: overrides,
        value: overrides,
        datePeriod: mockDatePeriod(overrides),
      });
    }

    if (typeof overrides === 'object') {
      const datePeriodOverride = overrides as DatePeriod;
      return mockHealthDataPoint({
        datePeriod: mockDatePeriod(datePeriodOverride),
      });
    }

    return mockHealthDataPoint(overrides);
  });
