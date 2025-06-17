import { useQuery } from '@tanstack/react-query';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { useMemo } from 'react';

export const useApiGetIndicatorMetaData = (indicatorID: string) => {
  const query = useQuery<IndicatorDocument>({
    queryKey: [`/indicator/${indicatorID}`],
    queryFn: () => ({}) as IndicatorDocument,
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
