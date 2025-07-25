import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import {
  IndicatorsQuartilesGetRequest,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { getAuthorisedQuartilesDataForAnIndicator } from '@/lib/chartHelpers/getAuthorisedQuartilesDataForAnIndicator';

export const useApiGetQuartiles = (options: IndicatorsQuartilesGetRequest) => {
  const { indicatorIds = [] } = options;
  const queryKey = [queryKeyFromRequestParams(EndPoints.Quartiles, options)];

  const query = useQuery<QuartileData[]>({
    queryKey,
    queryFn: async () => {
      return (await getAuthorisedQuartilesDataForAnIndicator(options)).filter(
        (q) => q.isAggregate === true
      );
    },
    enabled: indicatorIds.length >= 1,
  });

  return useMemo(() => {
    return {
      quartileData: query.data,
      quartileDataLoading: query.isLoading,
      quartileDataError: query.error,
    };
  }, [query.data, query.error, query.isLoading]);
};
