import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { Session } from 'next-auth';

export async function getAuthorisedHealthDataForAnIndicator(
  apiRequestParams: GetHealthDataForAnIndicatorRequest,
  session?: Session | null
): Promise<IndicatorWithHealthDataForArea> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }
  // TODO if this fails due to invalid session then fall back to getting published only
  const healthData =
    await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
      apiRequestParams,
      {
        ...API_CACHE_CONFIG,
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );

  return healthData;
}
