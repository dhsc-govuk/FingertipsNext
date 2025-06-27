// MUST BE AT THE TOP
import { mockUseApiGetQuartiles } from '@/mock/utils/mockUseApiGetQuartiles';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockUseApiGetHealthDataForMultipleIndicators } from '@/mock/utils/mockUseApiGetHealthDataForMultipleIndicators';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { renderHook } from '@testing-library/react';
import { useSpineChartData } from '@/components/charts/SpineChart/hooks/useSpineChartData';
import { buildSpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SearchParams } from '@/lib/searchStateManager';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { MockedFunction } from 'vitest';

vi.mock(
  '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData',
  () => ({
    buildSpineChartIndicatorData: vi.fn(() => 'mocked-chart-output'),
  })
);

mockUseApiGetHealthDataForMultipleIndicators.mockReturnValue({
  healthData: [mockIndicatorWithHealthDataForArea()],
  healthDataLoading: false,
  healthDataErrors: [],
  healthDataErrored: false,
});

const mockBuildSpineChartIndicatorData =
  buildSpineChartIndicatorData as MockedFunction<
    typeof buildSpineChartIndicatorData
  >;

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
  it('calls buildSpineChartIndicatorData with correct arguments and returns its output', async () => {
    const seedData: SeedData = {};
    seedData['/indicator/41101'] = indicator1;
    seedData['/indicator/22401'] = indicator2;

    const { result } = renderHook(() => useSpineChartData(), {
      wrapper: testRenderWrapper(seedData),
    });

    expect(mockUseApiGetQuartiles).toHaveBeenCalled();

    expect(buildSpineChartIndicatorData).toHaveBeenCalledTimes(1);
    expect(result.current).toBe('mocked-chart-output');

    const [
      combinedHealthData,
      indicatorMetaData,
      quartileData,
      areaCodes,
      selectedGroupCode,
    ] = mockBuildSpineChartIndicatorData.mock.calls[0];

    expect(Array.isArray(combinedHealthData)).toBe(true);
    expect(indicatorMetaData).toEqual([indicator1, indicator2]);
    expect(quartileData).toEqual([mockQuartileData()]);
    expect(areaCodes).toEqual(['E09000002', 'E09000003']);
    expect(selectedGroupCode).toEqual('E12000007');
  });

  it('returns undefined if insufficient data is available', async () => {
    const seedData: SeedData = {};
    seedData['/indicator/1234'] = indicator1;
    seedData['/indicator/5678'] = indicator2;

    const { result } = renderHook(() => useSpineChartData(), {
      wrapper: testRenderWrapper(seedData),
    });
    expect(result.current).toBe(undefined);
  });
});
