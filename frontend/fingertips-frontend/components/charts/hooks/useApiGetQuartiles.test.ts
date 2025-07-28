import { QueryClient } from '@tanstack/react-query';
import { useApiGetQuartiles } from './useApiGetQuartiles';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { renderHook } from '@testing-library/react';
import { IndicatorsQuartilesGetRequest } from '@/generated-sources/ft-api-client';
import { getAuthorisedQuartilesDataForAnIndicator } from '@/lib/chartHelpers/getAuthorisedQuartilesDataForAnIndicator';

vi.mock('@/lib/chartHelpers/getAuthorisedQuartilesDataForAnIndicator', () => ({
  getAuthorisedQuartilesDataForAnIndicator: vi.fn(),
}));

describe('useApiGetQuartiles', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const params: IndicatorsQuartilesGetRequest = { indicatorIds: [123] };

  it('should call getAuthorisedQuartilesDataForAnIndicator with the expected parameters', () => {
    // arrange
    const queryClient = new QueryClient();
    // act
    renderHook(() => useApiGetQuartiles(params), {
      wrapper: testRenderWrapper({}, queryClient),
    });

    expect(getAuthorisedQuartilesDataForAnIndicator).toHaveBeenCalledWith(
      params
    );
  });
});
