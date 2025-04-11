import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { API_CACHE_CONFIG } from '@/lib/apiClient/apiClientFactory';
import { chunkArray } from './chunkArray';

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
