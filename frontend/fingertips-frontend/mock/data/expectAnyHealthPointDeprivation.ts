import { DeprivationData } from '@/generated-sources/ft-api-client';

export const expectAnyHealthPointDeprivation = (
  overrides?: Partial<DeprivationData>
) => ({
  sequence: expect.any(Number),
  value: expect.any(String),
  type: expect.any(String),
  isAggregate: expect.any(Boolean),
  ...overrides,
});
