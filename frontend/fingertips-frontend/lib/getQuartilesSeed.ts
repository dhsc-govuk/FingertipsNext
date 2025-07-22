import { Session } from 'next-auth';
import { ApiClientFactory } from './apiClient/apiClientFactory';
import { IndicatorsQuartilesGetRequest } from '@/generated-sources/ft-api-client';

export const getQuartilesSeed = async (
  session: Session | null,
  quartilesParams: IndicatorsQuartilesGetRequest
) => {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  return session
    ? indicatorApi.indicatorsQuartilesAllGet(quartilesParams)
    : indicatorApi.indicatorsQuartilesGet(quartilesParams);
};
