import {
  GetHealthDataForAnIndicatorRequest,
  IndicatorWithHealthDataForArea,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { getAuthHeader } from '../auth/accessToken';
import { auth } from '../auth';

export async function getAuthorisedHealthDataForAnIndicator(
  apiRequestParams: GetHealthDataForAnIndicatorRequest
): Promise<IndicatorWithHealthDataForArea> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const authHeader = await getAuthHeader();
  const session = await auth();

  if (!session) {
    return await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }
  try {
    return await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
      apiRequestParams,
      {
        ...API_CACHE_CONFIG,
        headers: authHeader,
      }
    );
  } catch (error: unknown) {
    if (
      error instanceof ResponseError &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn(
        'Auth error getting unpublished healthdata, falling back to published health data endpoint'
      );
      // TODO: DHSCFT-1034 add in call to /user/indicator/{indicator_id} as alternative to fallback
      return await indicatorApi.getHealthDataForAnIndicator(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    }
    throw error;
  }
}
