import { OneIndicatorOneAreaDashboard } from '@/components/dashboards/OneIndicatorOneAreaDashboard';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';

type OneIndicatorOneAreaViewProps = {
  searchState: SearchStateParams;
};

export default async function OneIndicatorOneAreaView({
  searchState,
}: OneIndicatorOneAreaViewProps) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicators,
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const areasSelected = areaCodes ?? [];
  const indicatorsSelected = indicators ?? [];

  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [...areasSelected, areaCodeForEngland, selectedGroupCode]
      : [...areasSelected, areaCodeForEngland];

  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicatorsSelected[0]),
    areaCodes: areaCodesToRequest,
  });

  console.log('TODO: include inequalities data in healthData fetch');
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  return (
    <OneIndicatorOneAreaDashboard
      healthIndicatorData={[healthIndicatorData]}
      searchState={searchState}
    />
  );
}
