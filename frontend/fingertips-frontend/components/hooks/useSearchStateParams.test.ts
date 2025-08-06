import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return { ...originalModule, useSearchParams: vi.fn() };
});

const mockUseSearchParams = vi.mocked(useSearchParams);

describe('useSearchStateParams', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct values for both single and multi-value params', () => {
    const mockParams = new URLSearchParams();
    mockParams.set(SearchParams.SearchedIndicator, 'test');
    mockParams.append(SearchParams.AreasSelected, 'a1');
    mockParams.append(SearchParams.AreasSelected, 'a2');

    mockUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams(mockParams)
    );

    const { result } = renderHook(() => useSearchStateParams());

    expect(result.current[SearchParams.SearchedIndicator]).toBe('test');
    expect(result.current[SearchParams.AreasSelected]).toEqual(['a1', 'a2']);
  });

  it('should handle missing params gracefully', () => {
    const mockParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams(mockParams)
    );

    const { result } = renderHook(() => useSearchStateParams());

    Object.values(SearchParams).forEach((key) => {
      if (
        key === SearchParams.AreaTypeSelected ||
        key === SearchParams.GroupTypeSelected
      ) {
        expect(result.current[key]).toBe(englandAreaType.key);
      } else if (
        key === SearchParams.GroupSelected ||
        key === SearchParams.InequalityLineChartAreaSelected ||
        key === SearchParams.InequalityBarChartAreaSelected
      ) {
        expect(result.current[key]).toBe(areaCodeForEngland);
      } else if (
        key === SearchParams.IndicatorsSelected ||
        key === SearchParams.AreasSelected
      ) {
        expect(result.current[key]).toEqual([]);
      } else {
        expect(result.current[key]).toBeUndefined();
      }
    });
  });
});
