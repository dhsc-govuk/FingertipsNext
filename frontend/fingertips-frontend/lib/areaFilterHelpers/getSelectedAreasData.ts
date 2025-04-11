import { Area } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys, englandAreaType } from './areaType';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { chunkArray } from '../chunkArray';

const getAreas = async (areasToRetrieve: string[]): Promise<Area[]> => {
  const areasApi = ApiClientFactory.getAreasApiClient();

  const areaDataChunks = await Promise.all(
    chunkArray(areasToRetrieve).map((areaCodes) =>
      areasApi.getAreas(
        {
          areaCodes,
        },
        API_CACHE_CONFIG
      )
    )
  );

  return areaDataChunks.flat();
};

export const getSelectedAreasDataByAreaType = async (
  areasSelected?: string[],
  areaTypeSelected?: AreaTypeKeys
): Promise<Area[]> => {
  const determineAreaTypeSelected = areaTypeSelected ?? englandAreaType.key;

  const selectedAreasData =
    areasSelected && areasSelected?.length > 0
      ? (await getAreas(areasSelected)).filter(
          (area) => area.areaType.key === determineAreaTypeSelected
        )
      : [];

  if (
    areasSelected &&
    areasSelected.length > 0 &&
    selectedAreasData.length === 0
  ) {
    throw new Error('No area data found for any of the areas selected');
  }

  return selectedAreasData;
};
