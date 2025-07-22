// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import {
  mockGetHealthDataForAnIndicator,
  mockGetHealthDataForAnIndicatorIncludingUnpublishedData,
} from '@/mock/utils/mockApiClient';
//
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { SearchParams } from '@/lib/searchStateManager';
import { oneIndicatorRequestParams } from '../helpers/oneIndicatorRequestParams';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { useApiGetHealthDataForMultipleIndicators } from './useApiGetHealthDataForMultipleIndicators';

describe('useApiGetHealthDataForMultipleIndicators', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const options: GetHealthDataForAnIndicatorRequest[] = [
    oneIndicatorRequestParams(
      { [SearchParams.IndicatorsSelected]: ['333'] },
      []
    ),
    oneIndicatorRequestParams(
      { [SearchParams.IndicatorsSelected]: ['444'] },
      []
    ),
  ];

  it('should call getHealthDataForAnIndicatorIncludingUnpublishedData when session is present', async () => {
    const queryClient = new QueryClient();

    renderHook(() => useApiGetHealthDataForMultipleIndicators(options), {
      wrapper: testRenderWrapper({}, queryClient, {
        expires: 'some timestamp',
      }),
    });

    await waitFor(() => {
      expect(
        mockGetHealthDataForAnIndicatorIncludingUnpublishedData
      ).toHaveBeenNthCalledWith(1, {
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 333,
      });
      expect(
        mockGetHealthDataForAnIndicatorIncludingUnpublishedData
      ).toHaveBeenNthCalledWith(2, {
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 444,
      });
    });

    expect(mockGetHealthDataForAnIndicator).not.toHaveBeenCalled();
  });

  it('should call the published data endpoint when session is not present', async () => {
    const queryClient = new QueryClient();

    renderHook(() => useApiGetHealthDataForMultipleIndicators(options), {
      wrapper: testRenderWrapper({}, queryClient, null),
    });

    await waitFor(() => {
      expect(mockGetHealthDataForAnIndicator).toHaveBeenNthCalledWith(1, {
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 333,
      });
      expect(mockGetHealthDataForAnIndicator).toHaveBeenNthCalledWith(2, {
        ancestorCode: undefined,
        areaCodes: ['E92000001'],
        areaType: 'england',
        benchmarkRefType: 'England',
        indicatorId: 444,
      });
    });

    expect(
      mockGetHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
  });
});
