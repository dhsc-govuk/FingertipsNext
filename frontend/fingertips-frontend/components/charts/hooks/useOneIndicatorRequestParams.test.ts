// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { renderHook } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MockedFunction } from 'vitest';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';

vi.mock('@/components/charts/helpers/oneIndicatorRequestParams');

const mockOneIndicatorRequestParams =
  oneIndicatorRequestParams as MockedFunction<typeof oneIndicatorRequestParams>;

describe('useOneIndicatorRequestParams', () => {
  it('returns request params from helper using search state', async () => {
    const mockSearchState: SearchStateParams = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.GroupSelected]: 'G1',
      [SearchParams.AreaTypeSelected]: 'AT1',
      [SearchParams.BenchmarkAreaSelected]: 'BA1',
    };

    const mockRequest: GetHealthDataForAnIndicatorRequest = {
      indicatorId: 123,
      areaCodes: ['A1', 'E92000001'],
      inequalities: ['sex', 'deprivation'],
      areaType: 'AT1',
      benchmarkRefType: 'England',
    };

    mockUseSearchStateParams.mockReturnValue(mockSearchState);
    mockOneIndicatorRequestParams.mockReturnValue(mockRequest);

    const { result } = renderHook(() => useOneIndicatorRequestParams(), {
      wrapper: await testRenderWrapper({ availableAreas: [] }),
    });

    expect(result.current).toEqual(mockRequest);
    expect(mockOneIndicatorRequestParams).toHaveBeenCalledWith(
      mockSearchState,
      []
    );
  });
});
