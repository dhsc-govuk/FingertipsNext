import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import {
  Configuration,
  IndicatorsApi,
  IndicatorsQuartilesGetRequest,
  QuartileData,
} from '@/generated-sources/ft-api-client';

export const useApiGetQuartiles = (options: IndicatorsQuartilesGetRequest) => {
  const { indicatorIds = [] } = options;
  const queryKey = [queryKeyFromRequestParams(EndPoints.Quartiles, options)];

  const query = useQuery<QuartileData[]>({
    queryKey,
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_FINGERTIPS_API_URL;
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      const indicatorsApiInstance = new IndicatorsApi(config);
      return await indicatorsApiInstance.indicatorsQuartilesGet(options);
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
