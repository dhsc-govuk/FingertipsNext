import { useQuery } from '@tanstack/react-query';
import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { getAuthorisedHealthDataForAnIndicator } from '@/lib/chartHelpers/getAuthorisedHealthDataForAnIndicator';

type UseApiGetHealthDataForAnIndicatorResult = Readonly<{
  healthData: IndicatorWithHealthDataForArea | undefined;
  healthDataLoading: boolean;
  healthDataError: unknown;
}>;

export const queryFnHealthDataForAnIndicator =
  (
    apiRequestParams: GetHealthDataForAnIndicatorRequest,
    session?: Session | null
  ) =>
  async () => {
    return getAuthorisedHealthDataForAnIndicator(apiRequestParams, session);
  };

export const useApiGetHealthDataForAnIndicator = (
  apiRequestParams: GetHealthDataForAnIndicatorRequest
) => {
  const { data: session } = useSession();
  const queryKey = [
    queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      apiRequestParams
    ),
  ];

  const query = useQuery<IndicatorWithHealthDataForArea>({
    queryKey,
    queryFn: queryFnHealthDataForAnIndicator(apiRequestParams, session),
    enabled: !!apiRequestParams.indicatorId,
  });

  return useMemo<UseApiGetHealthDataForAnIndicatorResult>(() => {
    return {
      healthData: query.data,
      healthDataLoading: query.isLoading,
      healthDataError: query.error,
    };
  }, [query.data, query.error, query.isLoading]);
};
