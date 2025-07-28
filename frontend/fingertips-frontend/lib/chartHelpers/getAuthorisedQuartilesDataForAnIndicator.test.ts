import {
  BenchmarkReferenceType,
  IndicatorsApi,
  IndicatorsQuartilesGetRequest,
} from '@/generated-sources/ft-api-client';
import { mockAuth } from '@/mock/utils/mockAuth';
import { QueryClient } from '@tanstack/react-query';
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

  const options = {
    ancestorCode: 'E92000001',
    areaCode: 'E92000001',
    areaType: undefined,
    benchmarkRefType: BenchmarkReferenceType.England,
    indicatorIds: [333, 444],
  };

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
    mockAuth.mockResolvedValue({ expires: 'some string' });
    const queryClient = new QueryClient();

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
});
