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
): Promise<IndicatorWithHealthDataForArea> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const healthData = session
    ? await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
        apiRequestParams,
        API_CACHE_CONFIG
      )
    : // TODO if this fails due to invalid session then fall back to getting published only
      await indicatorApi.getHealthDataForAnIndicator(
        apiRequestParams,
        API_CACHE_CONFIG
      );
  return healthData;
}
