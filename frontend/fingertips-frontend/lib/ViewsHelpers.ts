import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const maxNumAreasThatCanBeRequestedAPI = 100;

/**
 * Returns arrayToChunk broken into multiple arrays of a size allowed to be used in API calls
 * @param arrayToChunk
 * @param chunkSize optional chunk size, which will be coerced within a range the API supports
 */
export function chunkArray(
  arrayToChunk: string[],
  chunkSize: number = maxNumAreasThatCanBeRequestedAPI
): string[][] {
  chunkSize = Math.max(
    1,
    Math.min(chunkSize, maxNumAreasThatCanBeRequestedAPI)
  );

  const chunkedArray = [];
  for (let i = 0; i < arrayToChunk.length; i += chunkSize) {
    chunkedArray.push(arrayToChunk.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

export interface HealthDataRequestAreas {
  areaCodes: string[];
  areaType?: string;
  inequalities?: GetHealthDataForAnIndicatorInequalitiesEnum[];
}

export const getHealthDataForIndicator = async (
  indicatorApi: IndicatorsApi,
  indicatorId: string | number,
  combinedRequestAreas: HealthDataRequestAreas[]
) => {
  let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;

  try {
    const healthIndicatorDataChunks = await Promise.all(
      combinedRequestAreas.flatMap((requestAreas) => {
        return chunkArray(requestAreas.areaCodes).map((areaCodes) =>
          indicatorApi.getHealthDataForAnIndicator(
            {
              indicatorId: Number(indicatorId),
              areaCodes: areaCodes,
              areaType: requestAreas.areaType,
              inequalities: requestAreas.inequalities,
            },
            API_CACHE_CONFIG
          )
        );
      })
    );

    healthIndicatorData = healthIndicatorDataChunks[0];

    healthIndicatorData.indicatorId =
      healthIndicatorData.indicatorId ?? Number(indicatorId);

    healthIndicatorData.areaHealthData = healthIndicatorDataChunks
      .map((indicatorData) => indicatorData?.areaHealthData ?? [])
      .flat();
  } catch (error) {
    throw new Error(`Error getting health indicator data for areas: ${error}`);
  }

  return healthIndicatorData;
};

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
          includeEmptyAreas,
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
          includeEmptyAreas,
        },
        API_CACHE_CONFIG
      )
    );
  }

  try {
    const healthIndicatorDataChunks = await Promise.all(indicatorRequestArray);
    indicatorDataAllAreas = healthIndicatorDataChunks[0];
    indicatorDataAllAreas.areaHealthData = healthIndicatorDataChunks.flatMap(
      (indicatorData) => indicatorData?.areaHealthData ?? []
    );
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }
  return indicatorDataAllAreas;
}
