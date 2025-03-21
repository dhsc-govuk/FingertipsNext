import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';

export default async function OneIndicatorOneAreaView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (areasSelected?.length !== 1 || indicatorSelected?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: areaCodesToRequest,
        inequalities: [GetHealthDataForAnIndicatorInequalitiesEnum.Sex],
        comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
      },
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  const indicatorMetadata = selectedIndicatorsData?.[0];

  return (
    <OneIndicatorOneAreaViewPlots
      healthIndicatorData={healthIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
