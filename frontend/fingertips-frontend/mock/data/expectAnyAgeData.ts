import { AgeData } from '@/generated-sources/ft-api-client';

export const expectAnyAgeData = (overrides?: Partial<AgeData>) => ({
  value: expect.any(String),
  isAggregate: expect.any(Boolean),
  ...overrides,
});
