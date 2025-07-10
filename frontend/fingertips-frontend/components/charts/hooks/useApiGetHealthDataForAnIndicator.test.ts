import {
  mockGetHealthDataForAnIndicator,
  mockGetHealthDataForAnIndicatorIncludingUnpublishedData,
} from '@/mock/utils/mockApiClient';

import { useApiGetHealthDataForAnIndicator } from './useApiGetHealthDataForAnIndicator';
import { renderHook, waitFor } from '@testing-library/react';
import {
  testRenderQueryClient,
  testRenderWrapper,
} from '@/mock/utils/testRenderQueryClient';
import { oneIndicatorRequestParams } from '../helpers/oneIndicatorRequestParams';
import { SearchParams } from '@/lib/searchStateManager';
import { QueryClient } from '@tanstack/query-core';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '../helpers/queryKeyFromRequestParams';

describe('useApiGetHealthDataForAnIndicator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call the published healthdata endpoint when there is no session', async () => {
    // arragnge
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

    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    // assert
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledWith({
      ancestorCode: undefined,
      areaCodes: ['E92000001'],
      areaType: 'england',
      benchmarkRefType: 'England',
      indicatorId: 123,
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
  it.todo(
    'should call the unpublished healthdata data endpoint if there is a session'
  );
});
