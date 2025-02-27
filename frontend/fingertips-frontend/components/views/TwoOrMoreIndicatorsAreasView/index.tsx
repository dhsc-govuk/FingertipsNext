import { TwoOrMoreIndicatorsAreasDashboard } from '@/components/dashboards/TwoOrMoreIndicatorsAreasDashboard';
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

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
}: OneIndicatorTwoOrMoreAreasViewProps) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const areasSelected = areaCodes ?? [];

  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [...areasSelected, areaCodeForEngland, selectedGroupCode]
      : [...areasSelected, areaCodeForEngland];

  await connection();

  console.log('TODO: fetch health data with inequalites');
  console.log(
    'TODO: fetch population data for ',
    areaCodesToRequest,
    toString()
  );

  return <TwoOrMoreIndicatorsAreasDashboard />;
}
