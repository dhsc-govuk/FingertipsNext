import { AreasApi, IndicatorsApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from './apiClientFactory';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as jest.Mock;

describe('apiClientFactory', () => {
  it('getAreasApiClient return an instance of the AreasApi', () => {
    const apiClient = ApiClientFactory.getAreasApiClient();

    expect(apiClient).toBeInstanceOf(AreasApi);
  });

  it('getIndicatorsApiClient return an instance of the IndicatorsApi', () => {
    const apiClient = ApiClientFactory.getIndicatorsApiClient();

    expect(apiClient).toBeInstanceOf(IndicatorsApi);
  });
});
