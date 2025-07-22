import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { auth } from '@/lib/auth';

export async function getAuthorisedHealthDataForAnIndicator(
  apiRequestParams: GetHealthDataForAnIndicatorRequest
): Promise<IndicatorWithHealthDataForArea> {
  const session = await auth();

  if (!session) {
    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
    return await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }
  // TODO: DHSCFT-1034 add in call to /user/indicator/{indicator_id} as alternative to fallback
  try {
    const indicatorApi =
      await ApiClientFactory.getAuthenticatedIndicatorsApiClient();
    return await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  } catch (error: unknown) {
    if (
      error instanceof ResponseError &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn(
        'Auth error getting unpublished healthdata, falling back to published health data endpoint'
      );
      const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
      return await indicatorApi.getHealthDataForAnIndicator(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    }
    throw error;
  }
}
