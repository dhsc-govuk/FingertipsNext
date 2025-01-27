import { AreasApi, IndicatorsApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from './apiClientFactory';

describe('apiClientFactory', () => {
  it('getAreasApiClient return an instace of the AreasApi', () => {
    const apiClient = ApiClientFactory.getAreasApiClient();

    expect(apiClient).toBeInstanceOf(AreasApi);
  });

  it('getIndicatorsApiClient return an instace of the IndicatorsApi', () => {
    const apiClient = ApiClientFactory.getIndicatorsApiClient();

    expect(apiClient).toBeInstanceOf(IndicatorsApi);
  });
});
