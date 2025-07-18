import { AgeData } from '@/generated-sources/ft-api-client';

export const mockAgeData = (overrides?: Partial<AgeData>) => ({
  value: 'All ages',
  isAggregate: true,
  ...overrides,
});
