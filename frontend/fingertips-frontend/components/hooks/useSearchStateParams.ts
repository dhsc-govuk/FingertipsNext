import { useSearchParams } from 'next/navigation';
import {
  isMultiValueTypeParam,
  SearchParams,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useMemo } from 'react';

export const useSearchStateParams = (): SearchStateParams => {
  const search = useSearchParams();

  return useMemo(() => {
    const searchStateParams: SearchStateParams = {};
    Object.values(SearchParams).forEach((key) => {
      if (!search) return;
      if (isMultiValueTypeParam(key)) {
        searchStateParams[key] = search.getAll(key);
      } else {
        searchStateParams[key] = search.get(key) ?? undefined;
      }
    });
    return searchStateParams;
  }, [search]);
};
