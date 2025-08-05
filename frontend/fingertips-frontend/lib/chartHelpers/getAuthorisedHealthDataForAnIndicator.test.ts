import { mockAuth, mockSession } from '@/mock/utils/mockAuth';
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
  UNPUBLISHED_API_CACHE_CONFIG,
} from '@/lib/apiClient/apiClientFactory';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;
ApiClientFactory.getAuthenticatedIndicatorsApiClient = async () =>
  mockIndicatorsApi;

const mockPublishedResponse = mockIndicatorWithHealthDataForArea();
const mockUnpublishedResponse = mockIndicatorWithHealthDataForArea({
  areaHealthData: [mockHealthDataForArea(), mockHealthDataForArea()],
});

mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
  mockPublishedResponse
);
mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockResolvedValue(
  mockUnpublishedResponse
);

const apiRequestParams: GetHealthDataForAnIndicatorRequest = {
  indicatorId: 1,
};

describe('getAuthorisedHealthDataForAnIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('calls getHealthDataForAnIndicatorIncludingUnpublishedData and returns unpublished data when session is provided', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result =
      await getAuthorisedHealthDataForAnIndicator(apiRequestParams);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, UNPUBLISHED_API_CACHE_CONFIG);
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
    ).toHaveBeenCalledWith(apiRequestParams, UNPUBLISHED_API_CACHE_CONFIG);
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
    ).toHaveBeenCalledWith(apiRequestParams, UNPUBLISHED_API_CACHE_CONFIG);
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockPublishedResponse);
  });

  it('calls the unpublished endpoints but throws an error if there is a session but the response is an error other than 401 or 403', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError500 = new ResponseError({ status: 500 } as Response);
    mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData.mockRejectedValue(
      responseError500
    );

    await expect(
      getAuthorisedHealthDataForAnIndicator(apiRequestParams)
    ).rejects.toThrow(responseError500);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith(apiRequestParams, UNPUBLISHED_API_CACHE_CONFIG);
  });
});
