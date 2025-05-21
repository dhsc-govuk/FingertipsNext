import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client/models/IndicatorWithHealthDataForArea';
import { connection } from 'next/server';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

export async function getIndicatorBenchmarkDataFromAPI(
  indicatorIDs: string[],
  areasSelected: string[],
  selectedGroupCode: string,
  areaTypeSelected: string
): Promise<IndicatorWithHealthDataForArea> {
  const areaCodes = determineAreaCodes(areasSelected);

  if (areaCodes?.length !== 1 || indicatorIDs?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areaCodes];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const areaTypeToUse =
    areaCodes[0] === areaCodeForEngland
      ? englandAreaType.key
      : areaTypeSelected;

  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  try {
    indicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorIDs[0]),
        areaCodes: areaCodesToRequest,
        areaType: areaTypeToUse,
      },
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }
  return indicatorData;
}
