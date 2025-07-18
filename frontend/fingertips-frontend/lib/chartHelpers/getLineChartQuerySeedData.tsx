import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { Session } from 'next-auth';

export async function getChartQuerySeedData(
  apiRequestParams: GetHealthDataForAnIndicatorRequest,
  session: Session | null
) {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  let healthData: IndicatorWithHealthDataForArea;

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
  return healthData;
}
