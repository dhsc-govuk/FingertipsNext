import { useSearchParams } from 'next/navigation';
import {
  isMultiValueTypeParam,
  SearchParams,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useMemo } from 'react';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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

    searchStateParams[SearchParams.AreaTypeSelected] ??= englandAreaType.key;
    searchStateParams[SearchParams.GroupTypeSelected] ??= englandAreaType.key;
    searchStateParams[SearchParams.GroupSelected] ??= areaCodeForEngland;

    return searchStateParams;
  }, [search]);
};
