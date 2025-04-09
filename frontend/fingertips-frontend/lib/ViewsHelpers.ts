import {
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { API_CACHE_CONFIG } from '@/lib/apiClient/apiClientFactory';

export const maxNumAreasThatCanBeRequestedAPI = 100;

export function chunkArray(
  arrayToChunk: string[],
  chunkSize: number = maxNumAreasThatCanBeRequestedAPI
) {
  const chunkedArray = [];
  for (let i = 0; i < arrayToChunk.length; i += chunkSize) {
    chunkedArray.push(arrayToChunk.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

export interface HealthDataRequestAreas {
  areaCodes: string[];
  areaType?: string;
}

export const getHealthDataForIndicator = async (
  indicatorApi: IndicatorsApi,
  indicatorId: string,
  requestAreass: HealthDataRequestAreas[]
) => {
  let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;

  try {
    const healthIndicatorDataChunks = await Promise.all(
      requestAreass.flatMap((requestAreas) => {
        return chunkArray(requestAreas.areaCodes).map((areaCodes) =>
          indicatorApi.getHealthDataForAnIndicator(
            {
              indicatorId: Number(indicatorId),
              areaCodes: areaCodes,
              areaType: requestAreas.areaType,
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
