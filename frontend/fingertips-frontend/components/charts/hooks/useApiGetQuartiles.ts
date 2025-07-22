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
import { useSession } from 'next-auth/react';
import { getQuartilesSeed } from '@/lib/getQuartilesSeed';

export const useApiGetQuartiles = (options: IndicatorsQuartilesGetRequest) => {
  const { data: session } = useSession();
  const { indicatorIds = [] } = options;
  const queryKey = [queryKeyFromRequestParams(EndPoints.Quartiles, options)];

  const query = useQuery<QuartileData[]>({
    queryKey,
    queryFn: async () => {
      return await getQuartilesSeed(session, options);
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
