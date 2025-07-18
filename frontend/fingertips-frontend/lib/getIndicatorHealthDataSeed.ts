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

export const getIndicatorHealthDataSeed = async (
  indicatorApi: IndicatorsApi,
  session: Session | null,
  searchState: SearchStateParams,
  availableAreas: Area[] | undefined
) => {
  let healthData: IndicatorWithHealthDataForArea | undefined;
  let queryKeySingleIndicator;
  const apiRequestParams = oneIndicatorRequestParams(
    searchState,
    availableAreas ?? []
  );
  if (session) {
    healthData =
      await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    queryKeySingleIndicator = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicatorIncludingUnpublished,
      apiRequestParams
    );
  } else {
    healthData = await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
    queryKeySingleIndicator = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      apiRequestParams
    );
  }

  return { healthData, queryKeySingleIndicator };
};
