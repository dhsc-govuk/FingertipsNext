import {
  mockGetHealthDataForAnIndicator,
  mockGetHealthDataForAnIndicatorIncludingUnpublishedData,
} from '@/mock/utils/mockApiClient';

import { useApiGetHealthDataForAnIndicator } from './useApiGetHealthDataForAnIndicator';
import { renderHook, waitFor } from '@testing-library/react';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { oneIndicatorRequestParams } from '../helpers/oneIndicatorRequestParams';
import { SearchParams } from '@/lib/searchStateManager';
import { QueryClient } from '@tanstack/query-core';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '../helpers/queryKeyFromRequestParams';
import { auth } from '@/lib/auth';
import { Mock } from 'vitest';

vi.mock('@/lib/auth', async () => {
  return {
    auth: vi.fn(),
  };
});
(auth as Mock).mockImplementation(vi.fn().mockResolvedValue(null));

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
    // arragnge
    const queryClient = new QueryClient();
    const session = await auth();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params, session), {
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
  it('should call the unpublished healthdata data endpoint if there is a session', async () => {
    // arrange
    (auth as Mock).mockImplementation(
      vi.fn().mockResolvedValue({ expires: 'some string' })
    );
    const queryClient = new QueryClient();
    const session = await auth();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params, session), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    // assert
    expect(
      mockGetHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalledWith({
      ancestorCode: undefined,
      areaCodes: ['E92000001'],
      areaType: 'england',
      benchmarkRefType: 'England',
      indicatorId: 123,
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
