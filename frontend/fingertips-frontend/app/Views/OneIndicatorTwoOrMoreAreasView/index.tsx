import { OneIndicatorTwoOrMoreAreasDashboard } from '@/components/dashboards/OneIndicatorTwoOrMoreAreasDashboard';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';

type OneIndicatorTwoOrMoreAreasViewProps = {
  searchState: SearchStateParams;
  // Group code for mapData
};

export default async function OneIndicatorTwoOrMoreAreasView({
  searchState,
}: OneIndicatorTwoOrMoreAreasViewProps) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicators,
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const areasSelected = areaCodes ?? [];
  const indicatorsSelected = indicators ?? [];

  //  TODO: edge case of England as area
  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [...areasSelected, areaCodeForEngland, selectedGroupCode]
      : [...areasSelected, areaCodeForEngland];

  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  // const healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator({
  //   indicatorId: Number(indicatorsSelected[0]),
  //   areaCodes: areaCodesToRequest,
  // });

  // TODO: inequalities data not in scope for view
  // TODO: get and pass population data
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);
  // TODO: get and pass map data
  console.log('TODO: fetch map data for GROUP');

  return (
    <OneIndicatorTwoOrMoreAreasDashboard
      searchState={searchState}
      healthIndicatorData={[]}
    />
  );
  // <>OneIndicatorTwoOrMoreAreasView</>;
}
