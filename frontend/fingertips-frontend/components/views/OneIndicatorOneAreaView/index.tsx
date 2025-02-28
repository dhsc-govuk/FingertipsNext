import { OneIndicatorOneAreaDashboard } from '@/components/dashboards/OneIndicatorOneAreaDashboard';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

type OneIndicatorOneAreaViewProps = {
  searchState: SearchStateParams;
};

export default async function OneIndicatorOneAreaView({
  searchState,
}: Readonly<OneIndicatorOneAreaViewProps>) {
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

  console.log('TODO: include inequalities data in healthData fetch');
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  return <OneIndicatorOneAreaDashboard />;
}
