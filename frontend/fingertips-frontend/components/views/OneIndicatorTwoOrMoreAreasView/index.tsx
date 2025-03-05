import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';

export default async function OneIndicatorTwoOrMoreAreasView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (
    indicatorSelected?.length !== 1 ||
    !areasSelected || // TODO: why is null assertion needed here?
    areasSelected?.length < 2
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected, areaCodeForEngland];
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();

  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);
  console.log('TODO: fetch map data for GROUP');

  return <OneIndicatorTwoOrMoreAreasViewPlots />;
}
