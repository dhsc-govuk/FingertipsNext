import { useSearchParams } from 'next/navigation';
import {
  isMultiValueTypeParam,
  SearchParams,
  SearchStateParams,
} from '@/lib/searchStateManager';

export const useSearchStateParams = (): SearchStateParams => {
  const search = useSearchParams() ?? new URLSearchParams();

  const searchStateParams: SearchStateParams = {};
  Object.values(SearchParams).forEach((key) => {
    if (isMultiValueTypeParam(key)) {
      searchStateParams[key] = search.getAll(key);
    } else {
      searchStateParams[key] = search.get(key) ?? undefined;
    }
  });

  return searchStateParams;
};
