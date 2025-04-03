import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  chunkArray,
  maxNumAreasThatCanBeRequestedAPI,
} from '@/lib/ViewsHelpers';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    (areasSelected?.length !== 1 && areasSelected?.[0] !== areaCodeForEngland)
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [areaCodeForEngland];

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const getHealthDataForIndicator = async (indicatorId: string) => {
    let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;
    try {
      const healthIndicatorDataChunks = await Promise.all(
        chunkArray(areaCodesToRequest, maxNumAreasThatCanBeRequestedAPI).map(
          (requestAreas) =>
            indicatorApi.getHealthDataForAnIndicator(
              {
                indicatorId: Number(indicatorId),
                areaCodes: [...requestAreas],
              },
              API_CACHE_CONFIG
            )
        )
      );

      healthIndicatorData = healthIndicatorDataChunks[0];
      if (!healthIndicatorData.indicatorId) {
        healthIndicatorData.indicatorId = Number(indicatorId);
      }

      healthIndicatorData.areaHealthData = healthIndicatorDataChunks
        .map((indicatorData) => indicatorData?.areaHealthData ?? [])
        .flat();
    } catch (error) {
      throw new Error(
        `error getting health indicator data for areas: ${error}`
      );
    }

    return healthIndicatorData;
  };

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicator);
    })
  );
  console.log('TODO: fetch health data with inequalites');
  console.log(`TODO: fetch population data for areas: [${areaCodesToRequest}]`);

  return (
    <TwoOrMoreIndicatorsEnglandViewPlots
      indicatorData={combinedIndicatorData}
      searchState={searchState}
      indicatorMetadata={selectedIndicatorsData}
    />
  );
}
