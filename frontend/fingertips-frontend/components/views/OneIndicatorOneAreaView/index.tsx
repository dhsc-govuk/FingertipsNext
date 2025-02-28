import { OneIndicatorOneAreaDashboard } from '@/components/dashboards/OneIndicatorOneAreaDashboard';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
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
}: Readonly<OneIndicatorOneAreaViewProps>) {
  // decomponse from stateManger
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.IndicatorsSelected]: indicators,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const areaSelected = areaCodes?.[0] ?? '';
  const indicatorSelected = indicators?.[0] ?? '';

  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [areaSelected, areaCodeForEngland, selectedGroupCode]
      : [areaSelected, areaCodeForEngland];

  // get required healthData
  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: Number(indicatorSelected),
      areaCodes: areaCodesToRequest,
    });
  } catch (error) {
    console.log('error getting health indicator data for area', error);
  }

  console.log({ selectedGroupCode });
  console.log('TODO: fetch population data for ', areaCodesToRequest[0]);

  // TODO: these should not be undefined by now
  if (healthIndicatorData && selectedGroupCode) {
    return (
      <OneIndicatorOneAreaDashboard
        healthIndicatorData={healthIndicatorData}
        selectedGroupCode={selectedGroupCode}
        searchState={searchState}
      />
    );
  }
  return <p>not worked!</p>;
}
