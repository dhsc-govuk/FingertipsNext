import {
  IndicatorsApi,
  IndicatorsQuartilesGetRequest,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import { mockAuth, mockSession } from '@/mock/utils/mockAuth';
import { waitFor } from '@testing-library/dom';
import { getAuthorisedQuartilesDataForAnIndicator } from './getAuthorisedQuartilesDataForAnIndicator';
import { mockDeep } from 'vitest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '../apiClient/apiClientFactory';
import { mockQuartileData } from '@/mock/data/mockQuartileData';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;
ApiClientFactory.getAuthenticatedIndicatorsApiClient = async () =>
  mockIndicatorsApi;

const apiRequestParams: IndicatorsQuartilesGetRequest = {
  indicatorIds: [1],
};

const mockPublishedResponse = [mockQuartileData()];
const mockUnpublishedResponse = [mockQuartileData(), mockQuartileData()];

mockIndicatorsApi.indicatorsQuartilesGet.mockResolvedValue(
  mockPublishedResponse
);
mockIndicatorsApi.indicatorsQuartilesAllGet.mockResolvedValue(
  mockUnpublishedResponse
);

describe('getAuthorisedQuartilesDataForAnIndicator', () => {
  afterEach(() => vi.clearAllMocks());

  it('should call the published quartiles endpoint when there is no session', async () => {
    // arrange
    mockAuth.mockResolvedValue(null);

    const result =
      await getAuthorisedQuartilesDataForAnIndicator(apiRequestParams);

    // assert
    await waitFor(() => {
      expect(mockIndicatorsApi.indicatorsQuartilesGet).toHaveBeenCalledWith(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    });
    expect(mockIndicatorsApi.indicatorsQuartilesAllGet).not.toHaveBeenCalled();
    expect(result).toEqual(mockPublishedResponse);
  });

  it('should call the unpublished quartiles endpoint when there is a session', async () => {
    // arrange
    mockAuth.mockResolvedValue(mockSession);

    // act
    const result =
      await getAuthorisedQuartilesDataForAnIndicator(apiRequestParams);

    // assert
    await waitFor(() => {
      expect(mockIndicatorsApi.indicatorsQuartilesAllGet).toHaveBeenCalledWith(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    });
    expect(mockIndicatorsApi.indicatorsQuartilesGet).not.toHaveBeenCalled();
    expect(result).toEqual(mockUnpublishedResponse);
  });

  it('calls both endpoints and returns published data if there is a session but the response from Unpublished data is 401', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError401 = new ResponseError({ status: 401 } as Response);
    mockIndicatorsApi.indicatorsQuartilesAllGet.mockRejectedValue(
      responseError401
    );
    const result =
      await getAuthorisedQuartilesDataForAnIndicator(apiRequestParams);

    expect(mockIndicatorsApi.indicatorsQuartilesAllGet).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(mockIndicatorsApi.indicatorsQuartilesGet).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockPublishedResponse);
  });

  it('calls both endpoints and returns published data if there is a session but the response from Unpublished data is 403', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError403 = new ResponseError({ status: 403 } as Response);
    mockIndicatorsApi.indicatorsQuartilesAllGet.mockRejectedValue(
      responseError403
    );
    const result =
      await getAuthorisedQuartilesDataForAnIndicator(apiRequestParams);

    expect(mockIndicatorsApi.indicatorsQuartilesAllGet).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(mockIndicatorsApi.indicatorsQuartilesGet).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockPublishedResponse);
  });

  it('calls the unpublished endpoints but throws an error if there is a session but the response is an error other than 401 or 403', async () => {
    mockAuth.mockResolvedValue(mockSession);
    const responseError500 = new ResponseError({ status: 500 } as Response);
    mockIndicatorsApi.indicatorsQuartilesAllGet.mockRejectedValue(
      responseError500
    );

    await expect(
      getAuthorisedQuartilesDataForAnIndicator(apiRequestParams)
    ).rejects.toThrow(responseError500);

    expect(mockIndicatorsApi.indicatorsQuartilesAllGet).toHaveBeenCalledWith(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  });
});
