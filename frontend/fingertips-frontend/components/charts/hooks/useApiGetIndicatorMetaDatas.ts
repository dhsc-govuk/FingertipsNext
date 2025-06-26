import { useQueries } from '@tanstack/react-query';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { useMemo } from 'react';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const useApiGetIndicatorMetaDatas = (indicatorIDs: string[]) => {
  const queries = useQueries<IndicatorDocument[]>({
    queries: indicatorIDs.map((id) => ({
      // all indicator metadata comes from AISearch not from the .NET API
      // this is here for consistency with that and to provide a hook based
      // way to access the indicators which will all be seeded into the query cache
      // when the page first loads
      queryKey: [`/indicator/${id}`],
      // the queryFn is effectively empty because we won't ever use it
      queryFn: () => ({}) as IndicatorDocument,
      // enabled is always false, because we always want the seeded data
      // we never want to query for it (we might in future revisit this)
      enabled: false,
    })),
  });

  return useMemo(() => {
    return {
      indicatorMetaData: queries
        .map(({ data }) => data)
        .filter(filterDefined) as IndicatorDocument[],
      indicatorMetaDataLoading: false,
      indicatorMetaDataError: null,
    };
  }, [queries]);
};
