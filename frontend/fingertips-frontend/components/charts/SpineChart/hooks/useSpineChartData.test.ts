// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseApiGetQuartiles } from '@/mock/utils/mockUseApiGetQuartiles';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { renderHook } from '@testing-library/react';
import { useSpineChartData } from '@/components/charts/SpineChart/hooks/useSpineChartData';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { SearchParams } from '@/lib/searchStateManager';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

const indicator1 = mockIndicatorDocument({ indicatorID: '41101' });
const indicator2 = mockIndicatorDocument({ indicatorID: '22401' });

const searchState = {
  [SearchParams.AreasSelected]: ['E09000002', 'E09000003'],
  [SearchParams.AreaTypeSelected]: 'districts-and-unitary-authorities',
  [SearchParams.IndicatorsSelected]: ['41101', '22401'],
  [SearchParams.GroupSelected]: 'E12000007',
  [SearchParams.GroupTypeSelected]: 'regions',
};
mockUseSearchStateParams.mockReturnValue(searchState);
mockUseApiGetQuartiles.mockReturnValue({
  quartileData: [mockQuartileData()],
  quartileDataError: null,
  quartileDataLoading: false,
});

describe('useSpineChartData', () => {
  it('returns it SpineChartIndicatorData[]', async () => {
    const { result } = renderHook(
      () =>
        useSpineChartData(
          [mockIndicatorWithHealthDataForArea()],
          [indicator1, indicator2]
        ),
      {
        wrapper: testRenderWrapper({}),
      }
    );

    expect(result.current).toHaveLength(1);
    expect(result.current?.at(0)).toHaveProperty(
      'rowId',
      '41101?sex=persons&age=all+ages'
    );
  });

  it('returns undefined if insufficient data is available', async () => {
    const { result } = renderHook(
      () => useSpineChartData([], [indicator1, indicator2]),
      {
        wrapper: testRenderWrapper({}),
      }
    );

    expect(result.current).toBe(undefined);
  });
});
