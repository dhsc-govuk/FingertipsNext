import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
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

  let combinedIndicatorData: IndicatorWithHealthDataForArea[];
  try {
    const promises = indicatorsSelected.map((indicator) => {
      return indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicator),
          areaCodes: areaCodesToRequest,
        },
        API_CACHE_CONFIG
      );
    });

    combinedIndicatorData = await Promise.all(promises);
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  console.log('combinedIndicatorData', combinedIndicatorData);

  let indicatorMetadata: (IndicatorDocument | undefined)[] = [];
  try {
    const promises = indicatorsSelected.map((indicator) => {
      return SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicator
      );
    });

    indicatorMetadata = await Promise.all(promises);
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }
  console.log('indicatorMetadata', indicatorMetadata);

  console.log('TODO: fetch health data with inequalites');
  console.log(`TODO: fetch population data for areas: [${areaCodesToRequest}]`);

  return (
    <TwoOrMoreIndicatorsEnglandViewPlots
      indicatorData={combinedIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
