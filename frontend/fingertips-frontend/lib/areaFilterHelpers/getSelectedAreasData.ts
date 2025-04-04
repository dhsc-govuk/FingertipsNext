import { Area } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from './areaType';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

export const getSelectedAreasDataByAreaType = async (
  areasSelected: string[] | undefined,
  areaTypeSelected: AreaTypeKeys
): Promise<Area[]> => {
  const areasApi = ApiClientFactory.getAreasApiClient();

  return areasSelected && areasSelected?.length > 0
    ? (
        await areasApi.getAreas(
          {
            areaCodes: areasSelected ?? [],
          },
          API_CACHE_CONFIG
        )
      ).filter((area) => area.areaType.key === areaTypeSelected)
    : [];
};
