import { OnceIndicatorOneAreaDashboard } from '@/components/dashboards/OnceIndicatorOneAreaDashboard';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { shouldDisplayInequalities } from '../../../components/organisms/Inequalities/inequalitiesHelpers';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';

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

  //  TODO: edge case of England as area
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

  // TODO: get (and pass) inequalities data
  console.log('TODO: include inequalities data in healthData fetch');
  // TODO: get and pass population data
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  return (
    <OnceIndicatorOneAreaDashboard
      healthIndicatorData={[healthIndicatorData]}
      searchState={searchState}
    />
  );
}
