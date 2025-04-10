import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import { useIndicatorSort } from '@/components/forms/IndicatorSort/useIndicatorSort';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { SortOrderKeys } from '@/components/forms/IndicatorSort/indicatorSort.types';
import { ChangeEvent } from 'react';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: mockSetIsLoading,
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
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

describe('useIndicatorSort', () => {
  const mockResults = [mockBanana, mockApple, mockDamson, mockCherry];
  it('should not change the sort order when relevance is selected', () => {
    const { result } = renderHook(() => useIndicatorSort(mockResults));

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
    const { result } = renderHook(() => useIndicatorSort(mockResults));
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

  it('should limit the results to 20', () => {
    mockGetSearchState.mockImplementation(() => ({
      [SearchParams.SearchedOrder]: SortOrderKeys.updated,
    }));
    const lotsOfResults = new Array(30).map(() => mockApple);
    const { result } = renderHook(() => useIndicatorSort(lotsOfResults));
    expect(result.current.sortedResults).toHaveLength(20);
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
});
