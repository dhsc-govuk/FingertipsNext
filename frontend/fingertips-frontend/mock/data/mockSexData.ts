import { SexData } from '@/generated-sources/ft-api-client';

export const mockSexData = (overrides?: Partial<SexData>) => ({
  value: 'Persons',
  isAggregate: true,
  ...overrides,
});
