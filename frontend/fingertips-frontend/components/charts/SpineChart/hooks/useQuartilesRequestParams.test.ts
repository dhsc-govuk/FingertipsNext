// MUST BE AT THE TOP
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';
import { renderHook } from '@testing-library/react';
import { useQuartilesRequestParams } from '@/components/charts/SpineChart/hooks/useQuartilesRequestParams';
import { SearchParams } from '@/lib/searchStateManager';

mockUseSearchStateParams.mockReturnValue({
  [SearchParams.AreasSelected]: ['A1'],
  [SearchParams.IndicatorsSelected]: ['101', '102'],
  [SearchParams.GroupSelected]: 'GROUP1',
  [SearchParams.AreaTypeSelected]: 'ICB',
  [SearchParams.BenchmarkAreaSelected]: 'ENG',
});

describe('useQuartilesRequestParams', () => {
  it('returns memoized quartiles request params from search state', () => {
    const { result } = renderHook(() => useQuartilesRequestParams());

    expect(result.current).toEqual({
      indicatorIds: [101, 102],
      areaCode: 'A1',
      ancestorCode: 'GROUP1',
      areaType: 'ICB',
      benchmarkRefType: BenchmarkReferenceType.SubNational,
    });
  });
});
