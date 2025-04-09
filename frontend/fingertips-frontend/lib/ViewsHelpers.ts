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

export const getHealthDataForIndicator = async (
  indicatorApi: IndicatorsApi,
  indicatorId: string,
  areaCodesToRequest: string[]
) => {
  let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;

  try {
    const healthIndicatorDataChunks = await Promise.all(
      chunkArray(areaCodesToRequest).map((requestedAreas) =>
        indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: Number(indicatorId),
            areaCodes: [...requestedAreas],
          },
          API_CACHE_CONFIG
        )
      )
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
