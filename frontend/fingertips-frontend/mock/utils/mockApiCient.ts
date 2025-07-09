import { MockedClass } from 'vitest';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';

vi.mock('@/generated-sources/ft-api-client');

export const mockIndicatorsApi = IndicatorsApi as MockedClass<
  typeof IndicatorsApi
>;

export const mockGetHealthDataForAnIndicator = vi.fn(() => ({}));
export const mockIndicatorsQuartilesGet = vi.fn(() => ({}));

mockIndicatorsApi.mockImplementation(
  () =>
    ({
      getHealthDataForAnIndicator: mockGetHealthDataForAnIndicator,
      indicatorsQuartilesGet: mockIndicatorsQuartilesGet,
    }) as unknown as IndicatorsApi
);
