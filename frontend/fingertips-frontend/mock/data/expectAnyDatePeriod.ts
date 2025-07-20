import { DatePeriod } from '@/generated-sources/ft-api-client';

export const expectAnyDatePeriod = (overrides?: Partial<DatePeriod>) => ({
  type: expect.any(String),
  from: expect.any(Date),
  to: expect.any(Date),
  ...overrides,
});
