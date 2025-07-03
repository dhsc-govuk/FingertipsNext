import { useQuery } from '@tanstack/react-query';
import {
  Configuration,
  GetHealthDataForAnIndicatorRequest,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { useMemo } from 'react';

type UseApiGetHealthDataForAnIndicatorResult = Readonly<{
  healthData: IndicatorWithHealthDataForArea | undefined;
  healthDataLoading: boolean;
  healthDataError: unknown;
}>;

export const queryFnHealthDataForAnIndicator =
  (options: GetHealthDataForAnIndicatorRequest) => async () => {
    const apiUrl = process.env.NEXT_PUBLIC_FINGERTIPS_API_URL;
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
    });

    const indicatorsApiInstance = new IndicatorsApi(config);
    return indicatorsApiInstance.getHealthDataForAnIndicator(options);
  };

export const useApiGetHealthDataForAnIndicator = (
  options: GetHealthDataForAnIndicatorRequest
) => {
  const queryKey = [
    queryKeyFromRequestParams(EndPoints.HealthDataForAnIndicator, options),
  ];

  const query = useQuery<IndicatorWithHealthDataForArea>({
    queryKey,
    queryFn: queryFnHealthDataForAnIndicator(options),
    enabled: !!options.indicatorId,
  });

  return useMemo<UseApiGetHealthDataForAnIndicatorResult>(() => {
    return {
      healthData: query.data,
      healthDataLoading: query.isLoading,
      healthDataError: query.error,
    };
  }, [query.data, query.error, query.isLoading]);
};
