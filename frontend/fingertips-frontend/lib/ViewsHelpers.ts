import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from './apiClient/apiClientFactory';

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

export const fetchIndicatorWithHealthDataForAreaInBatches = async (
  populationIndicatorID: number,
  areaCodesToRequest: string[],
  inequalities: GetHealthDataForAnIndicatorInequalitiesEnum[]
): Promise<IndicatorWithHealthDataForArea | undefined> => {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  let population: IndicatorWithHealthDataForArea | undefined = undefined;

  await Promise.all(
    chunkArray(areaCodesToRequest).map(async (requestAreas) => {
      try {
        const data = await indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: populationIndicatorID,
            areaCodes: requestAreas,
            inequalities: inequalities,
          },
          API_CACHE_CONFIG
        );

        if (!population) {
          population = data;
        } else {
          population.areaHealthData?.push(...(data.areaHealthData ?? []));
        }
      } catch (error) {
        console.error(
          'error getting population health indicator data for area',
          error
        );
      }
    })
  );
  return population;
};
