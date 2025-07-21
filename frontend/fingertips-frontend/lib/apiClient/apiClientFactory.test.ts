import {
  AreasApi,
  BatchesApi,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from './apiClientFactory';
import { Mock } from 'vitest';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as Mock;

describe('apiClientFactory', () => {
  it('getAreasApiClient return an instance of the AreasApi', () => {
    const apiClient = ApiClientFactory.getAreasApiClient();

    expect(apiClient).toBeInstanceOf(AreasApi);
  });

  it('getIndicatorsApiClient return an instance of the IndicatorsApi', () => {
    const apiClient = ApiClientFactory.getIndicatorsApiClient();

    expect(apiClient).toBeInstanceOf(IndicatorsApi);
  });

  it('getBatchesApiClient return an instance of the BatchesApi', () => {
    const apiClient = ApiClientFactory.getBatchesApiClient();

    expect(apiClient).toBeInstanceOf(BatchesApi);
  });

  it('getAuthenticatedIndicatorsApiClient return an instance of the IndicatorsApi', async () => {
    const apiClient =
      await ApiClientFactory.getAuthenticatedIndicatorsApiClient();

    expect(apiClient).toBeInstanceOf(IndicatorsApi);
  });

  it('getAuthenticatedBatchesApiClient return an instance of the BatchesApi', async () => {
    const apiClient = await ApiClientFactory.getAuthenticatedBatchesApiClient();

    expect(apiClient).toBeInstanceOf(BatchesApi);
  });
});
