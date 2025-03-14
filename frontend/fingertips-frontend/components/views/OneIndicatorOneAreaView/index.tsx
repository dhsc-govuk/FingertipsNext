import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';

import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export default async function OneIndicatorOneAreaView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (areasSelected?.length !== 1 || indicatorSelected?.length !== 1) {
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

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: Number(indicatorSelected[0]),
      areaCodes: areaCodesToRequest,
      comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
    });
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  let indicatorMetadata: IndicatorDocument | undefined;
  try {
    indicatorMetadata =
      await SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicatorSelected[0]
      );
  } catch (error) {
    console.error(
      'error getting meta data for health indicator for area',
      error
    );
  }

  return (
    <OneIndicatorOneAreaViewPlots
      healthIndicatorData={healthIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
