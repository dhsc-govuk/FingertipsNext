import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.AreasSelected]: areasSelected } =
    stateManager.getSearchState();

  if (
    areasSelected! &&
    areasSelected.length !== 1 &&
    areasSelected[0] !== areaCodeForEngland
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = areaCodeForEngland;

  await connection();

  console.log('TODO: fetch health data with inequalites');
  console.log(
    'TODO: fetch population data for ',
    areaCodesToRequest,
    toString()
  );

  return <TwoOrMoreIndicatorsEnglandViewPlots />;
}
