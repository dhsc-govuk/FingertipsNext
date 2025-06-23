import { renderHook } from '@testing-library/react';
import { useCompareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableRequestParams';

import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';
import { compareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableRequestParams';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  Area,
  GetHealthDataForAnIndicatorRequest,
} from '@/generated-sources/ft-api-client';

vi.mock('@/components/hooks/useSearchStateParams');
vi.mock('@/components/charts/hooks/useApiAvailableAreas');
vi.mock(
  '@/components/charts/CompareAreasTable/helpers/compareAreasTableRequestParams'
);

const mockUseSearchStateParams = useSearchStateParams as MockedFunction<
  typeof useSearchStateParams
>;
const mockUseApiAvailableAreas = useApiAvailableAreas as MockedFunction<
  typeof useApiAvailableAreas
>;
const mockCompareAreasTableRequestParams =
  compareAreasTableRequestParams as MockedFunction<
    typeof compareAreasTableRequestParams
  >;

describe('useCompareAreasTableRequestParams', () => {
  it('returns the expected request params', () => {
    const mockSearchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['123'],
    };
    const mockAvailableAreas = [
      { code: 'E06000001', name: 'Area A' },
    ] as Area[];
    const mockExpectedResult: GetHealthDataForAnIndicatorRequest = {
      indicatorId: 123,
      areaCodes: ['E06000001'],
    };

    mockUseSearchStateParams.mockReturnValue(mockSearchState);
    mockUseApiAvailableAreas.mockReturnValue({
      availableAreas: mockAvailableAreas,
      availableAreasError: null,
      availableAreasLoading: false,
    });
    mockCompareAreasTableRequestParams.mockReturnValue(mockExpectedResult);

    const { result } = renderHook(() => useCompareAreasTableRequestParams());

    expect(result.current).toEqual(mockExpectedResult);
    expect(mockCompareAreasTableRequestParams).toHaveBeenCalledWith(
      mockSearchState,
      mockAvailableAreas
    );
  });
});
