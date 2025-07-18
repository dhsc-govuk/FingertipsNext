import { DatePeriod, PeriodType } from '@/generated-sources/ft-api-client';

export const mockDatePeriod = (
  overrides?: Partial<DatePeriod> | number | undefined
) => {
  if (overrides === undefined || typeof overrides === 'number') {
    const year = overrides ?? 2023;
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
