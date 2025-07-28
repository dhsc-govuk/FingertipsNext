import { mockAuth, mockSession } from '@/mock/utils/mockAuth';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { useApiGetHealthDataForAnIndicator } from './useApiGetHealthDataForAnIndicator';
import { renderHook, waitFor } from '@testing-library/react';
import { oneIndicatorRequestParams } from '../helpers/oneIndicatorRequestParams';
import { SearchParams } from '@/lib/searchStateManager';
import { QueryClient } from '@tanstack/query-core';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '../helpers/queryKeyFromRequestParams';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockDeep } from 'vitest-mock-extended';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

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

describe('useApiGetHealthDataForAnIndicator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const params = oneIndicatorRequestParams(
    { [SearchParams.IndicatorsSelected]: ['123'] },
    []
  );
  const queryKeyForHealthData = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    params
  );

  it('should call the published healthdata endpoint when there is no session', async () => {
    // arrange
    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    // assert
    await waitFor(() => {
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenCalledWith(
        {
          ancestorCode: undefined,
          areaCodes: ['E92000001'],
          areaType: 'england',
          benchmarkRefType: 'England',
          indicatorId: 123,
        },
        API_CACHE_CONFIG
      );
    });
    await waitFor(() => {
      const actualData = queryClient.getQueryData([queryKeyForHealthData]);
      expect(actualData).toEqual(mockPublishedResponse);
    });

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
  });

  it('should call the unpublished healthdata data endpoint if there is a session', async () => {
    // arrange
    const queryClient = new QueryClient();
    mockAuth.mockResolvedValue(mockSession);

    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    // assert
    await waitFor(() => {
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicatorIncludingUnpublishedData
      ).toHaveBeenCalledWith(
        {
          ancestorCode: undefined,
          areaCodes: ['E92000001'],
          areaType: 'england',
          benchmarkRefType: 'England',
          indicatorId: 123,
        },
        API_CACHE_CONFIG
      );
    });

    await waitFor(() => {
      const actualData = queryClient.getQueryData([queryKeyForHealthData]);
      expect(actualData).toEqual(mockUnpublishedResponse);
    });
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).not.toHaveBeenCalled();
  });
});
