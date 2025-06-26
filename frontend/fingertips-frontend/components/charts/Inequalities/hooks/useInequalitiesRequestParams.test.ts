// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { renderHook } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useInequalitiesRequestParams } from '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';
import { MockedFunction } from 'vitest';

vi.mock('@/components/charts/Inequalities/helpers/inequalitiesRequestParams');

const mockInequalitiesRequestParams =
  inequalitiesRequestParams as MockedFunction<typeof inequalitiesRequestParams>;

describe('useLineChartOverTimeRequestParams', () => {
  it('returns request params from helper using search state', () => {
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
    mockInequalitiesRequestParams.mockReturnValue(mockRequest);

    const { result } = renderHook(() => useInequalitiesRequestParams());

    expect(result.current).toEqual(mockRequest);
    expect(mockInequalitiesRequestParams).toHaveBeenCalledWith(mockSearchState);
  });
});
