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

export async function getAuthorisedHealthDataForAnIndicator(
  apiRequestParams: GetHealthDataForAnIndicatorRequest
): Promise<IndicatorWithHealthDataForArea> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const authHeader = await getAuthHeader();

  console.log('getAuthorisedHealthDataForAnIndicator, authHeader:', authHeader);

  if (!authHeader) {
    return await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }
  try {
    const response =
      await indicatorApi.getHealthDataForAnIndicatorIncludingUnpublishedData(
        apiRequestParams,
        {
          ...API_CACHE_CONFIG,
          headers: authHeader,
        }
      );
    console.log('in try, response:', response);
    return response;
  } catch (error: unknown) {
    if (
      error instanceof ResponseError &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        'Auth error getting unpublished healthdata, falling back to published health data endpoint'
      );
      console.warn(
        'Auth error getting unpublished healthdata, falling back to published health data endpoint'
      );
      return await indicatorApi.getHealthDataForAnIndicator(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    }
    throw error;
  }
}
