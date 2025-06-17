import { useQuery } from '@tanstack/react-query';
import {
  Configuration,
  GetHealthDataForAnIndicatorRequest,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { queryKeyFromRequestParams } from '@/components/charts/helpers/queryKeyFromRequestParams';
import { useMemo } from 'react';

export const useApiGetHealthDataForAnIndicator = (
  options: GetHealthDataForAnIndicatorRequest
) => {
  const queryKey = [queryKeyFromRequestParams(options)];
  const query = useQuery<IndicatorWithHealthDataForArea>({
    queryKey,
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_FINGERTIPS_API_URL;
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      const indicatorsApiInstance = new IndicatorsApi(config);
      return indicatorsApiInstance.getHealthDataForAnIndicator(options);
    },
    enabled: !!options.indicatorId,
    gcTime: 60 * 1000,
  });

  return useMemo(() => {
    return {
      healthData: query.data,
      healthDataLoading: query.isLoading,
      healthDataError: query.error,
    };
  }, [query.data, query.error, query.isLoading]);
};
