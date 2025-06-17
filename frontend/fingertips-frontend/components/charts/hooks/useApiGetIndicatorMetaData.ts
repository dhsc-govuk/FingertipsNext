import { useQuery } from '@tanstack/react-query';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { useMemo } from 'react';

export const useApiGetIndicatorMetaData = (indicatorID: string) => {
  const query = useQuery<IndicatorDocument>({
    // all indicator metadata comes from AISearch not from the .NET API
    // this is here for consistency with that and to provide a hook based
    // way to access the indicators which will all be seeded into the query cache
    // when the page first loads
    queryKey: [`/indicator/${indicatorID}`],
    // the queryFn is effectively empty because we won't ever use it
    queryFn: () => ({}) as IndicatorDocument,
    // enabled is always false, because we always want the seeded data
    // we never want to query for it (we might in future revisit this)
    enabled: false,
  });

  return useMemo(() => {
    return {
      indicatorMetaData: query.data,
      indicatorMetaDataLoading: query.isLoading,
      indicatorMetaDataError: query.error,
    };
  }, [query.data, query.isLoading, query.error]);
};
