import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    !areasSelected ||
    areasSelected?.length != 1
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthIndicatorData: HealthDataForArea[][];
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

    const results = await Promise.all(promises);

    healthIndicatorData = results;
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  let indicatorMetadata: (IndicatorDocument | undefined)[];
  try {
    const promises = indicatorsSelected.map((indicator) => {
      return SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicator
      );
    });

    const results = await Promise.all(promises);

    indicatorMetadata = results;
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  return (
    <TwoOrMoreIndicatorsAreasViewPlot
      healthIndicatorData={healthIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
