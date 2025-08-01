import {
  IndicatorsQuartilesGetRequest,
  QuartileData,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
  UNPUBLISHED_API_CACHE_CONFIG,
} from '@/lib/apiClient/apiClientFactory';
import { auth } from '@/lib/auth';

export async function getAuthorisedQuartilesDataForAnIndicator(
  apiRequestParams: IndicatorsQuartilesGetRequest
): Promise<QuartileData[]> {
  const session = await auth();

  if (!session) {
    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
    return await indicatorApi.indicatorsQuartilesGet(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  }

  try {
    const indicatorApi =
      await ApiClientFactory.getAuthenticatedIndicatorsApiClient();
    return await indicatorApi.indicatorsQuartilesAllGet(
      apiRequestParams,
      UNPUBLISHED_API_CACHE_CONFIG
    );
  } catch (error: unknown) {
    if (
      error instanceof ResponseError &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn(
        `Auth error getting unpublished healthdata for ${apiRequestParams.indicatorIds}, falling back to published health data endpoint`
      );
      const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
      return await indicatorApi.indicatorsQuartilesGet(
        apiRequestParams,
        API_CACHE_CONFIG
      );
    }
    throw error;
  }
}
