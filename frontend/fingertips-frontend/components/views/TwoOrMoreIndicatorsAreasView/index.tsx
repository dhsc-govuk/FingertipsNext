import { TwoOrMoreIndicatorsAreasViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { chunkArray, maxIndicatorAPIRequestSize } from '@/lib/ViewsHelpers';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (!indicatorsSelected || indicatorsSelected.length < 2 || !areasSelected) {
    throw new Error('Invalid parameters provided to view');
  }

  if (!selectedIndicatorsData) {
    throw new Error('Unable to retrieve indicator metadata');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }

  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();

  const getHealthDataForIndicator = async (indicatorId: string) => {
    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
    let healthIndicatorData: HealthDataForArea[] | undefined;
    try {
      healthIndicatorData = (
        await Promise.all(
          chunkArray(areaCodesToRequest, maxIndicatorAPIRequestSize).map(
            (requestAreas) =>
              indicatorApi.getHealthDataForAnIndicator(
                {
                  indicatorId: Number(indicatorId),
                  areaCodes: [...requestAreas],
                },
                API_CACHE_CONFIG
              )
          )
        )
      )
        .map((indicatorData) => indicatorData?.areaHealthData ?? [])
        .flat();
    } catch (error) {
      console.error('error getting health indicator data for areas', error);
      throw new Error('error getting health indicator data for areas');
    }

    return healthIndicatorData;
  };

  const healthDataForAllIndicators = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicator);
    })
  );

  const groupAreaCode =
    selectedGroupCode && selectedGroupCode !== areaCodeForEngland
      ? selectedGroupCode
      : undefined;

  console.log(`TODO: fetch population data for areas: [${areaCodesToRequest}]`);

  return (
    <TwoOrMoreIndicatorsAreasViewPlots
      indicatorMetadata={selectedIndicatorsData}
      healthData={healthDataForAllIndicators}
      groupAreaCode={groupAreaCode}
    />
  );
}
