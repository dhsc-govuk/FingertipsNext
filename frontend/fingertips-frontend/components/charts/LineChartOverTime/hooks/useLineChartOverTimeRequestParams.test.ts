// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { useLineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeRequestParams';
import { lineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeRequestParams';
import { renderHook } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { MockedFunction } from 'vitest';

vi.mock(
  '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeRequestParams'
);

const mockLineChartOverTimeRequestParams =
  lineChartOverTimeRequestParams as MockedFunction<
    typeof lineChartOverTimeRequestParams
  >;

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
    mockLineChartOverTimeRequestParams.mockReturnValue(mockRequest);

    const { result } = renderHook(() => useLineChartOverTimeRequestParams());

    expect(result.current).toEqual(mockRequest);
    expect(mockLineChartOverTimeRequestParams).toHaveBeenCalledWith(
      mockSearchState
    );
  });
});
