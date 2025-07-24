import {
  mockGetHealthDataForAnIndicator,
  mockGetHealthDataForAnIndicatorIncludingUnpublishedData,
} from '@/mock/utils/mockApiClient';
// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
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
import { mockSession } from '@/mock/utils/mockAuth';

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
  const queryKeyForHealthDataIncludingUnpublished = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicatorIncludingUnpublished,
    params
  );

  it('should call the published healthdata endpoint when there is no session', async () => {
    // arrange
    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient, null),
    });

    // assert
    await waitFor(() => {
      expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledWith({
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 123,
      });
    });
    await waitFor(() => {
      const actualData = queryClient.getQueryData([queryKeyForHealthData]);
      expect(actualData).not.toBeUndefined();
    });

    expect(
      mockGetHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
    await waitFor(() => {
      const actualData = queryClient.getQueryData([
        queryKeyForHealthDataIncludingUnpublished,
      ]);
      expect(actualData).toBeUndefined();
    });
  });

  it('should call the unpublished healthdata data endpoint if there is a session', async () => {
    // arrange
    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient, mockSession()),
    });

    // assert
    await waitFor(() => {
      expect(
        mockGetHealthDataForAnIndicatorIncludingUnpublishedData
      ).toHaveBeenCalledWith({
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 123,
      });
    });

    await waitFor(() => {
      const actualData = queryClient.getQueryData([
        queryKeyForHealthDataIncludingUnpublished,
      ]);
      expect(actualData).not.toBeUndefined();
    });

    expect(mockGetHealthDataForAnIndicator).not.toHaveBeenCalled();
    await waitFor(() => {
      const actualData = queryClient.getQueryData([queryKeyForHealthData]);
      expect(actualData).toBeUndefined();
    });
  });
});
