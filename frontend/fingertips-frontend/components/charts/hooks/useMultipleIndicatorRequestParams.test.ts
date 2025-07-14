// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { useMultipleIndicatorRequestParams } from '@/components/charts/hooks/useMultipleIndicatorRequestParams';

mockUseSearchStateParams.mockReturnValue({
  [SearchParams.AreasSelected]: ['E09000002', 'E09000003'],
  [SearchParams.IndicatorsSelected]: ['41101', '22401'],
  [SearchParams.GroupSelected]: 'E12000007',
  [SearchParams.AreaTypeSelected]: 'districts-and-unitary-authorities',
  [SearchParams.GroupTypeSelected]: 'regions',
});

describe('useSpineChartRequestParams', () => {
  it('returns memoized request params from search state', () => {
    const { result } = renderHook(() => useMultipleIndicatorRequestParams());

    expect(result.current).toHaveLength(6);
  });
});
