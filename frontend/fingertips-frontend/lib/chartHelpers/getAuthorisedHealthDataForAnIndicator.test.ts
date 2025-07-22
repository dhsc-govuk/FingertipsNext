import { mockAuth } from '@/mock/utils/mockAuth';
import { getAuthorisedHealthDataForAnIndicator } from './getAuthorisedHealthDataForAnIndicator';
import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorsApi,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'vitest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { Session } from 'next-auth';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;
ApiClientFactory.getAuthenticatedIndicatorsApiClient = async () =>
  mockIndicatorsApi;

const mockPublishedResponse = mockIndicatorWithHealthDataForArea();
const mockUnpublishedResponse = mockIndicatorWithHealthDataForArea({
  areaHealthData: [mockHealthDataForArea(), mockHealthDataForArea()],
});

mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockResolvedValue(
  mockUnpublishedResponse
);
mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
  mockPublishedResponse
);

const mockSession = mockDeep<Session>();
mockAuth.mockResolvedValue(mockSession);

const apiRequestParams: GetHealthDataForAnIndicatorRequest = {
  indicatorId: 1,
};

describe('getChartQuerySeedData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('calls getHealthDataForAnIndicatorIncludingUnpublishedData and returns unpublished data when session is provided', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result =
      await getAuthorisedHealthDataForAnIndicator(apiRequestParams);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, API_CACHE_CONFIG);
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).not.toHaveBeenCalled();
    expect(result).toEqual(mockUnpublishedResponse);
  });

  it('calls getHealthDataForAnIndicator and returns published data when session is not provided', async () => {
    mockAuth.mockResolvedValue(null);
    const result =
      await getAuthorisedHealthDataForAnIndicator(apiRequestParams);

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
    expect(result).toEqual(mockPublishedResponse);
  });

  it('calls both endpoints and returns published data if there is a session but the response from Unpublished data is 401', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError401 = new ResponseError({ status: 401 } as Response);
    mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockRejectedValue(
      responseError401
    );
    const result =
      await getAuthorisedHealthDataForAnIndicator(apiRequestParams);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, API_CACHE_CONFIG);
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockPublishedResponse);
  });

  it('calls both endpoints and returns published data if there is a session but the response from Unpublished data is 403', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError403 = new ResponseError({ status: 403 } as Response);
    mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockRejectedValue(
      responseError403
    );
    const result =
      await getAuthorisedHealthDataForAnIndicator(apiRequestParams);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, API_CACHE_CONFIG);
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockPublishedResponse);
  });
});
