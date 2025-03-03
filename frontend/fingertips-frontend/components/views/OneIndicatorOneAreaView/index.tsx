import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';

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

  const areaCodesToRequest = [...areasSelected, areaCodeForEngland];
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: Number(indicatorSelected),
      areaCodes: areaCodesToRequest,
    });
  } catch (error) {
    console.log('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  // console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  return (
    <OneIndicatorOneAreaViewPlots
      healthIndicatorData={healthIndicatorData}
      selectedGroupCode={selectedGroupCode}
      searchState={searchState}
    />
  );
}
