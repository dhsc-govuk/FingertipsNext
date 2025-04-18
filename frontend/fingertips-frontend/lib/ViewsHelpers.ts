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
import { chunkArray } from '@/lib/chunkArray';

export interface HealthDataRequestAreas {
  areaCodes: string[];
  areaType?: string;
  inequalities?: GetHealthDataForAnIndicatorInequalitiesEnum[];
}

export const getHealthDataForIndicator = async (
  indicatorApi: IndicatorsApi,
  indicatorId: string | number,
  combinedRequestAreas: HealthDataRequestAreas[],
  latestOnly?: boolean
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
              latestOnly,
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

export interface GetIndicatorDataParam {
  areasSelected: string[];
  indicatorSelected: string[];
  selectedAreaType?: string;
  selectedGroupCode?: string;
  selectedGroupType?: string;
}

export async function getIndicatorData(
  {
    areasSelected,
    indicatorSelected,
    selectedAreaType,
    selectedGroupCode,
    selectedGroupType,
  }: GetIndicatorDataParam,
  includeEmptyAreas: boolean,
  latestOnly?: boolean
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
        latestOnly,
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
          latestOnly,
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
          latestOnly,
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
