import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import { useIndicatorSort } from '@/components/forms/IndicatorSort/useIndicatorSort';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { SortOrderKeys } from '@/components/forms/IndicatorSort/indicatorSort.types';
import { ChangeEvent } from 'react';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSetIsLoading = vi.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: mockSetIsLoading,
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockGetSearchState = vi.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: vi.fn(),
};
vi.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const mockApple = {
  indicatorName: 'Apple',
  lastUpdatedDate: new Date('2000/12/25'),
} as IndicatorDocument;
const mockBanana = {
  indicatorName: 'Banana',
  lastUpdatedDate: new Date('2005/12/25'),
} as IndicatorDocument;
const mockCherry = {
  indicatorName: 'Cherry',
  lastUpdatedDate: new Date('2010/12/25'),
} as IndicatorDocument;
const mockDamson = {
  indicatorName: 'Damson',
  lastUpdatedDate: new Date('2015/12/25'),
} as IndicatorDocument;

const mockSetCurrentPage = vi.fn();

describe('useIndicatorSort', () => {
  const mockResults = [mockBanana, mockApple, mockDamson, mockCherry];
  it('should not change the sort order when relevance is selected', () => {
    const { result } = renderHook(() =>
      useIndicatorSort(mockResults, mockSetCurrentPage)
    );

    expect(result.current.sortedResults).toEqual([
      mockBanana,
      mockApple,
      mockDamson,
      mockCherry,
    ]);
  });

  it('should change the sort order to alphabetical', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.alphabetical,
    }));
    const { result } = renderHook(() =>
      useIndicatorSort(mockResults, mockSetCurrentPage)
    );
    expect(result.current.selectedSortOrder).toEqual(
      SortOrderKeys.alphabetical
    );
    expect(result.current.sortedResults).toEqual([
      mockApple,
      mockBanana,
      mockCherry,
      mockDamson,
    ]);
  });

  it('should change the sort order to most recently updated', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.updated,
    }));
    const { result } = renderHook(() => useIndicatorSort(mockResults));
    expect(result.current.selectedSortOrder).toEqual(SortOrderKeys.updated);
    expect(result.current.sortedResults).toEqual([
      mockDamson,
      mockCherry,
      mockBanana,
      mockApple,
    ]);
  });

  it('should not change the sort order when nonsense is given as an order term', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: 'foobar',
    }));
    const { result } = renderHook(() => useIndicatorSort(mockResults));
    expect(result.current.selectedSortOrder).toEqual(SortOrderKeys.relevance);
    expect(result.current.sortedResults).toEqual([
      mockBanana,
      mockApple,
      mockDamson,
      mockCherry,
    ]);
  });

  it('should not limit the results to 20', () => {
    // we have previously limited the results to 20, but don't anymore.
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.updated,
    }));
    const lotsOfResults = new Array(35).map(() => mockApple);
    const { result } = renderHook(() => useIndicatorSort(lotsOfResults));
    expect(result.current.sortedResults).toHaveLength(35);
  });

  it('should return a callback function to use on the select element', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.updated,
      [SearchParams.IndicatorsSelected]: [1, 2, 3],
    }));

    const { result } = renderHook(() => useIndicatorSort(mockResults));
    expect(result.current).toHaveProperty('handleSortOrder');
    const { handleSortOrder } = result.current;
    expect(typeof handleSortOrder).toBe('function');

    handleSortOrder({
      target: { value: SortOrderKeys.alphabetical },
    } as ChangeEvent<HTMLSelectElement>);
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedOrder}=alphabetical`,
      { scroll: false }
    );
  });

  it('should call the provided setCurrentPage function when handleSortOrder is called', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.updated,
    }));

    const { result } = renderHook(() =>
      useIndicatorSort(mockResults, mockSetCurrentPage)
    );
    const { handleSortOrder } = result.current;

    handleSortOrder({
      target: { value: SortOrderKeys.alphabetical },
    } as ChangeEvent<HTMLSelectElement>);
    expect(mockSetCurrentPage).toHaveBeenCalled();
  });
});
