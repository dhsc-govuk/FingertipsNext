import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = jest.requireMock('next/navigation').useSearchParams;

describe('useSearchStateParams', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct values for both single and multi-value params', () => {
    const mockParams = new URLSearchParams();
    mockParams.set(SearchParams.SearchedIndicator, 'test');
    mockParams.append(SearchParams.AreasSelected, 'a1');
    mockParams.append(SearchParams.AreasSelected, 'a2');

    mockUseSearchParams.mockReturnValue(mockParams);

    const { result } = renderHook(() => useSearchStateParams());

    expect(result.current[SearchParams.SearchedIndicator]).toBe('test');
    expect(result.current[SearchParams.AreasSelected]).toEqual(['a1', 'a2']);
  });

  it('should handle missing params gracefully', () => {
    const mockParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue(mockParams);

    const { result } = renderHook(() => useSearchStateParams());

    Object.values(SearchParams).forEach((key) => {
      if (
        key === SearchParams.AreaTypeSelected ||
        key === SearchParams.GroupTypeSelected
      ) {
        expect(result.current[key]).toBe(englandAreaType.key);
      } else if (key === SearchParams.GroupSelected) {
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
