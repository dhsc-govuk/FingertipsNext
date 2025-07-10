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
import { Session } from 'next-auth';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

type UseApiGetHealthDataForAnIndicatorResult = Readonly<{
  healthData: IndicatorWithHealthDataForArea | undefined;
  healthDataLoading: boolean;
  healthDataError: unknown;
}>;

export const queryFnHealthDataForAnIndicator =
  (options: GetHealthDataForAnIndicatorRequest, session?: Session | null) =>
  async () => {
    const apiUrl = process.env.NEXT_PUBLIC_FINGERTIPS_API_URL;
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
    });

    const indicatorsApiInstance = new IndicatorsApi(config);
    return session
      ? indicatorsApiInstance.getHealthDataForAnIndicatorIncludingUnpublishedData(
          options
        )
      : indicatorsApiInstance.getHealthDataForAnIndicator(options);
  };

export const useApiGetHealthDataForAnIndicator = (
  options: GetHealthDataForAnIndicatorRequest,
  session?: Session | null
) => {
  const queryKey = session
    ? [
        queryKeyFromRequestParams(
          EndPoints.HealthDataForAnIndicatorIncludingUnpublished,
          options
        ),
      ]
    : [queryKeyFromRequestParams(EndPoints.HealthDataForAnIndicator, options)];

  const query = useQuery<IndicatorWithHealthDataForArea>({
    queryKey,
    queryFn: queryFnHealthDataForAnIndicator(options, session),
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
