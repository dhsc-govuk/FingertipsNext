import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { queryFnHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const useApiGetHealthDataForMultipleIndicators = (
  options: GetHealthDataForAnIndicatorRequest[]
) => {
  const queries = useQueries({
    queries: options.map((option) => ({
      queryKey: [
        queryKeyFromRequestParams(EndPoints.HealthDataForAnIndicator, option),
      ],
      queryFn: queryFnHealthDataForAnIndicator(option),
    })),
  });

  return useMemo(() => {
    const healthData = queries.map(({ data }) => data);
    const healthDataLoading = queries.some(({ isLoading }) => isLoading);
    const healthDataErrored = queries.some(({ error }) => error);
    const healthDataErrors = queries
      .map(({ error }) => error)
      .filter((error) => !!error);
    return {
      healthData: healthData.filter(
        filterDefined
      ) as IndicatorWithHealthDataForArea[],
      healthDataLoading,
      healthDataErrored,
      healthDataErrors,
    };
  }, [queries]);
};
