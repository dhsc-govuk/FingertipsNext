import { TwoOrMoreIndicatorsAreasViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';

interface TwoOrMoreIndicatorsAreasViewProps extends ViewProps {
  areaCodes: string[];
}

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  areaCodes,
}: Readonly<TwoOrMoreIndicatorsAreasViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.GroupSelected]: selectedGroupCode } =
    stateManager.getSearchState();
  const areasSelected = areaCodes;

  if (!areasSelected) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected, areaCodeForEngland];
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();

  return <TwoOrMoreIndicatorsAreasViewPlots />;
}
