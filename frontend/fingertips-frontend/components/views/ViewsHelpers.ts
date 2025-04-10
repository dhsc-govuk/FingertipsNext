import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client/models/IndicatorWithHealthDataForArea';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { chunkArray } from '@/lib/ViewsHelpers';
import { connection } from 'next/server';

// DHSCFT-518: use API flag from 517 to get data for all requested areas with healthdata[] for areas with no data
export async function getIndicatorDataAllAreas(
  areasSelected: string[],
  indicatorSelected: string[],
  selectedAreaType?: string,
  selectedGroupCode?: string,
  selectedGroupType?: string
) {
  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorDataAllAreas: IndicatorWithHealthDataForArea | undefined;

  const indicatorRequestArray = chunkArray(areasSelected).map((requestAreas) =>
    indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: [...requestAreas],
        areaType: selectedAreaType,
        // TODO: add flag to get all areas from DHSCFT-517
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
