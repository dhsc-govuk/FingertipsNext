import { TwoOrMoreIndicatorsEnglandDashboard } from '@/components/dashboards/TwoOrMoreIndicatorsEnglandDashboard';
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
};

export default async function TwoOrMoreIndicatorsEnglandView({
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

  // TODO: add inequalities to data fetch
  console.log('TODO: fetch health data with inequalites');
  // TODO: get and pass population data
  console.log(
    'TODO: fetch population data for ',
    areaCodesToRequest,
    toString()
  );

  return (
    <TwoOrMoreIndicatorsEnglandDashboard
      searchState={searchState}
      healthIndicatorData={[]}
    />
  );
}
