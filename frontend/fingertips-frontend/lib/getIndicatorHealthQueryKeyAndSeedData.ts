import {
  Area,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { Session } from 'next-auth';
import { SearchStateParams } from './searchStateManager';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { API_CACHE_CONFIG } from './apiClient/apiClientFactory';
import {
  queryKeyFromRequestParams,
  EndPoints,
} from '@/components/charts/helpers/queryKeyFromRequestParams';

export const getIndicatorHealthQueryKeyAndSeedData = async (
  indicatorApi: IndicatorsApi,
  session: Session | null,
  searchState: SearchStateParams,
  availableAreas: Area[] | undefined
) => {
  let healthData: IndicatorWithHealthDataForArea | undefined;
  const apiRequestParams = oneIndicatorRequestParams(
    searchState,
    availableAreas ?? []
  );
  const queryKeySingleIndicator = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    apiRequestParams
  );
  if (session) {
    healthData =
      await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
        apiRequestParams,
        API_CACHE_CONFIG
      );
  } else {
    healthData = await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }

  return { healthData, queryKeySingleIndicator };
};
