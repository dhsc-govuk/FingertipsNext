import { AgeData, SexData } from '@/generated-sources/ft-api-client';

export const expectAnyHealthPointInequality = (
  overrides?: Partial<SexData | AgeData>
) => ({
  value: expect.any(String),
  isAggregate: expect.any(Boolean),
  ...overrides,
});
