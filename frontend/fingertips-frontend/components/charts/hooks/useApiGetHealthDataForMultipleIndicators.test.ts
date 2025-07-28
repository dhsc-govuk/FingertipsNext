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
import { mockAuth } from '@/mock/utils/mockAuth';

vi.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator', () => ({
  queryFnHealthDataForAnIndicator: vi.fn((option) => async () => {
    return { indicatorId: option.indicatorId };
  }),
}));

import { queryFnHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';

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

  it('should call queryFnHealthDataForAnIndicator for each request option', async () => {
    const queryClient = new QueryClient();

    renderHook(() => useApiGetHealthDataForMultipleIndicators(options), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    await waitFor(() => {
      expect(queryFnHealthDataForAnIndicator).toHaveBeenCalledTimes(2);
      expect(queryFnHealthDataForAnIndicator).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ indicatorId: 333 })
      );
      expect(queryFnHealthDataForAnIndicator).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ indicatorId: 444 })
      );
    });
  });
});
