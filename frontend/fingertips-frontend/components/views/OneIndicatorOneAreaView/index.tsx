import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { ViewProps } from '../ViewsContext';

export default async function OneIndicatorOneAreaView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (areasSelected?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected, areaCodeForEngland];
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  console.log('TODO: include inequalities data in healthData fetch');
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  return <OneIndicatorOneAreaViewPlots />;
}
