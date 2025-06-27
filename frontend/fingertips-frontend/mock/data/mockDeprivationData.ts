import { DeprivationData } from '@/generated-sources/ft-api-client';

export const mockDeprivationData = (overrides?: Partial<DeprivationData>) => ({
  sequence: 1,
  value: 'Persons',
  type: 'Persons',
  isAggregate: true,
  ...overrides,
});
