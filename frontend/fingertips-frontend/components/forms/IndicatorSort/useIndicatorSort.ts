import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { ChangeEvent, useCallback } from 'react';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SortOrderKeys } from '@/components/forms/IndicatorSort/indicatorSort.types';
import { usePathname, useRouter } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';

export const maxResults = 20;

export const useIndicatorSort = (results: IndicatorDocument[]) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();
  const stateManager = SearchStateManager.initialise(searchState);

  const sortOrderFromState = searchState?.[SearchParams.SearchedOrder];

  const selectedSortOrder = (
    Object.keys(SortOrderKeys).includes(sortOrderFromState ?? '')
      ? sortOrderFromState
      : SortOrderKeys.relevance
  ) as SortOrderKeys;

  const handleSortOrder = (e: ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const newSortOrder = e.target.value;
    stateManager.addParamValueToState(SearchParams.SearchedOrder, newSortOrder);
    stateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);
    replace(stateManager.generatePath(pathname), { scroll: false });
  };

  const sortFunction = useCallback(
    (a: IndicatorDocument, b: IndicatorDocument) => {
      if (selectedSortOrder === SortOrderKeys.updated) {
        return b.lastUpdatedDate.getTime() - a.lastUpdatedDate.getTime();
      }

      // alphabetical
      return a.indicatorName.localeCompare(b.indicatorName, 'en', {
        sensitivity: 'base',
      });
    },
    [selectedSortOrder]
  );

  const sorted =
    selectedSortOrder === SortOrderKeys.relevance
      ? results
      : results.toSorted(sortFunction);

  const sortedResults = sorted.slice(0, maxResults);

  return { sortedResults, handleSortOrder, selectedSortOrder };
};
