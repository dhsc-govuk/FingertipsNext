import { SexData } from '@/generated-sources/ft-api-client';

export const expectAnySexData = (overrides?: Partial<SexData>) => ({
  value: expect.any(String),
  isAggregate: expect.any(Boolean),
  ...overrides,
});
