import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { getAuthHeader } from '../auth/accessToken';

export async function getAuthorisedHealthDataForAnIndicator(
  apiRequestParams: GetHealthDataForAnIndicatorRequest
): Promise<IndicatorWithHealthDataForArea> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const authHeader = await getAuthHeader();

  if (!authHeader) {
    // if (!accessToken) {
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
        headers: authHeader,
      }
    );

  return healthData;
}
