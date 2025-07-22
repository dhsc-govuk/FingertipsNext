// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import {
  mockGetHealthDataForAnIndicator,
  mockGetHealthDataForAnIndicatorIncludingUnpublishedData,
} from '@/mock/utils/mockApiClient';
//
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { useApiGetHealthDataForAnIndicator } from './useApiGetHealthDataForAnIndicator';
import { renderHook, waitFor } from '@testing-library/react';
import { oneIndicatorRequestParams } from '../helpers/oneIndicatorRequestParams';
import { SearchParams } from '@/lib/searchStateManager';
import { QueryClient } from '@tanstack/query-core';

describe('useApiGetHealthDataForAnIndicator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const params = oneIndicatorRequestParams(
    { [SearchParams.IndicatorsSelected]: ['123'] },
    []
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

    expect(
      mockGetHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
  });

  it('should call the unpublished healthdata data endpoint if there is a session', async () => {
    // arrange
    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}, queryClient, {
        expires: 'some string',
      }),
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

    expect(mockGetHealthDataForAnIndicator).not.toHaveBeenCalled();
  });
});
