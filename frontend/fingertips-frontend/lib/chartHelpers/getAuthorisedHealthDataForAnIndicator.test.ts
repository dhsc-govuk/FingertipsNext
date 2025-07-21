import { getAuthorisedHealthDataForAnIndicator } from './getAuthorisedHealthDataForAnIndicator';
import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'vitest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '../apiClient/apiClientFactory';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const apiRequestParams: GetHealthDataForAnIndicatorRequest = {
  indicatorId: 1,
};

const mockResponse = mockIndicatorWithHealthDataForArea();
mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockResolvedValue(
  mockResponse
);
mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(mockResponse);

describe('getChartQuerySeedData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('calls getHealthDataForAnIndicatorIncludingUnpublishedData when session is provided', async () => {
    const result = await getAuthorisedHealthDataForAnIndicator(
      apiRequestParams,
      {
        expires: 'some string',
      }
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, API_CACHE_CONFIG);
    expect(result).toEqual(mockResponse);
  });

  it('calls getHealthDataForAnIndicator when session is not provided', async () => {
    const result = await getAuthorisedHealthDataForAnIndicator(
      apiRequestParams,
      null
    );

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockResponse);
  });
});
