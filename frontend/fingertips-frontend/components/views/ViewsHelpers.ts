import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client/models/IndicatorWithHealthDataForArea';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { chunkArray } from '@/lib/ViewsHelpers';

/**
 *
 * @param areasSelected
 * @param indicatorSelected
 * @param selectedAreaType
 * @param selectedGroupCode
 * @param selectedGroupType
 * @param includeEmptyAreas if true, requests that the server return no-data/empty-array
 * for areas that have no matching data. if false, non-matching areas will be excluded
 * from the results
 */
export async function getIndicatorData(
  {
    areasSelected,
    indicatorSelected,
    selectedAreaType,
    selectedGroupCode,
    selectedGroupType,
  }: {
    areasSelected: string[];
    indicatorSelected: string[];
    selectedAreaType?: string;
    selectedGroupCode?: string;
    selectedGroupType?: string;
  },
  includeEmptyAreas: boolean
) {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorDataAllAreas: IndicatorWithHealthDataForArea | undefined;

  const indicatorRequestArray = chunkArray(areasSelected).map((requestAreas) =>
    indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: [...requestAreas],
        areaType: selectedAreaType,
        includeEmptyAreas,
      },
      API_CACHE_CONFIG
    )
  );

  if (!areasSelected.includes(areaCodeForEngland)) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [areaCodeForEngland],
          areaType: englandAreaType.key,
          // TODO: add flag to get all areas from DHSCFT-517
        },
        API_CACHE_CONFIG
      )
    );
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [selectedGroupCode],
          areaType: selectedGroupType,
          // TODO: add flag to get all areas from DHSCFT-517
        },
        API_CACHE_CONFIG
      )
    );
  }

  try {
    const healthIndicatorDataChunks = await Promise.all(indicatorRequestArray);
    indicatorDataAllAreas = healthIndicatorDataChunks[0];
    indicatorDataAllAreas.areaHealthData = healthIndicatorDataChunks
      .map((indicatorData) => indicatorData?.areaHealthData ?? [])
      .flat();
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }
  return indicatorDataAllAreas;
}
