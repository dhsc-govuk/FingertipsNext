import {
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  HealthDataForArea,
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
import { SeedDataPromises } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';

export interface HealthDataRequestAreas {
  areaCodes: string[];
  areaType?: string;
  inequalities?: GetHealthDataForAnIndicatorInequalitiesEnum[];
}

export const getHealthDataForIndicator = async (
  indicatorApi: IndicatorsApi,
  indicatorId: string | number,
  combinedRequestAreas: HealthDataRequestAreas[],
  benchmarkRefType?: BenchmarkReferenceType,
  latestOnly?: boolean,
  areaGroup?: string,
  seedPromises?: SeedDataPromises
) => {
  let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;

  try {
    const healthIndicatorDataChunks = await Promise.all(
      combinedRequestAreas.flatMap((requestAreas) => {
        return chunkArray(requestAreas.areaCodes).map((areaCodes) => {
          const reqOptions = {
            indicatorId: Number(indicatorId),
            areaCodes: areaCodes,
            areaType: requestAreas.areaType,
            inequalities: requestAreas.inequalities,
            latestOnly,
            benchmarkRefType,
            ancestorCode: areaGroup,
          };
          const queryKey = queryKeyFromRequestParams(
            EndPoints.HealthDataForAnIndicator,
            reqOptions
          );

          const promiseOfData = indicatorApi.getHealthDataForAnIndicator(
            reqOptions,
            API_CACHE_CONFIG
          );
          if (seedPromises) {
            seedPromises[queryKey] = promiseOfData;
          }

          return promiseOfData;
        });
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

/**
 * Retrieves the latest year from the area health data in the API response.
 * Note: this MUST only be used in the context of requests that use the latest_only parameter.
 * @param areaHealthDataList
 * @returns - the latest data for the year or undefined
 */
function getLatestYearFromResponseData(
  areaHealthDataList: HealthDataForArea[]
): number | undefined {
  return areaHealthDataList.find(
    (areaHealthData) => areaHealthData.healthData.length
  )?.healthData[0].year;
}

/**
 * Retrieves data for England and group - where applicable - that corresponds to the latest year
 * of the area data that has already been obtained.
 *
 * @param param0 - GetIndicatorDataParam
 * @param subAreaHealthData - the area health data for the requested area codes
 * @returns - a flattened array containing both the original area health data and health data for England
 * and the requested group, where applicable
 */
async function getLatestYearDataForGroupAndEngland(
  {
    areasSelected,
    indicatorSelected,
    selectedGroupCode,
    selectedGroupType,
  }: GetIndicatorDataParam,
  subAreaHealthData: HealthDataForArea[]
): Promise<HealthDataForArea[]> {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const latestYear = getLatestYearFromResponseData(subAreaHealthData);
  const indicatorRequestArray = [];

  const defaultApiRequestParams = latestYear
    ? {
        indicatorId: Number(indicatorSelected[0]),
        years: [latestYear],
      }
    : {
        indicatorId: Number(indicatorSelected[0]),
        latestOnly: true,
      };

  if (!areasSelected.includes(areaCodeForEngland)) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          ...defaultApiRequestParams,
          areaCodes: [areaCodeForEngland],
          areaType: englandAreaType.key,
        },
        API_CACHE_CONFIG
      )
    );
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          ...defaultApiRequestParams,
          areaCodes: [selectedGroupCode],
          areaType: selectedGroupType,
        },
        API_CACHE_CONFIG
      )
    );
  }

  try {
    const healthIndicatorResponses = await Promise.all(indicatorRequestArray);
    return healthIndicatorResponses.flatMap(
      (indicatorData) => indicatorData?.areaHealthData ?? []
    );
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }
}

export async function getIndicatorData(
  {
    areasSelected,
    indicatorSelected,
    selectedAreaType,
    selectedGroupCode,
    selectedGroupType,
  }: GetIndicatorDataParam,
  benchmarkRefType: BenchmarkReferenceType,
  latestOnly?: boolean
) {
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorDataAllAreas: IndicatorWithHealthDataForArea | undefined;

  const ancestorCode =
    benchmarkRefType === BenchmarkReferenceType.SubNational
      ? selectedGroupCode
      : undefined;

  const indicatorRequestArray = chunkArray(areasSelected).map(
    (requestAreas) => {
      return indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [...requestAreas],
          areaType: selectedAreaType,
          latestOnly,
          benchmarkRefType,
          ancestorCode,
        },
        API_CACHE_CONFIG
      );
    }
  );

  if (!areasSelected.includes(areaCodeForEngland) && !latestOnly) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [areaCodeForEngland],
          areaType: englandAreaType.key,
          latestOnly,
          benchmarkRefType,
          ancestorCode,
        },
        API_CACHE_CONFIG
      )
    );
  }

  if (
    selectedGroupCode &&
    selectedGroupCode !== areaCodeForEngland &&
    !latestOnly
  ) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [selectedGroupCode],
          areaType: selectedGroupType,
          latestOnly,
          benchmarkRefType,
          ancestorCode,
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

  if (latestOnly) {
    const latestDataForGroupAndEngland =
      await getLatestYearDataForGroupAndEngland(
        {
          areasSelected,
          indicatorSelected,
          selectedGroupCode,
          selectedGroupType,
        },
        indicatorDataAllAreas.areaHealthData
      );
    indicatorDataAllAreas.areaHealthData.push(...latestDataForGroupAndEngland);
  }

  return indicatorDataAllAreas;
}

export function determineBenchmarkRefType(
  benchmarkAreaSelected?: string
): BenchmarkReferenceType {
  if (benchmarkAreaSelected && benchmarkAreaSelected !== areaCodeForEngland) {
    return BenchmarkReferenceType.SubNational;
  }
  return BenchmarkReferenceType.England;
}
