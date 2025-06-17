import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { lineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeRequestParams';

export default async function OneIndicatorOneAreaView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(areasSelected);

  if (areaCodes?.length !== 1 || indicatorSelected?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthData: IndicatorWithHealthDataForArea | undefined;
  const apiRequestParams = lineChartOverTimeRequestParams(searchState);
  try {
    healthData = await indicatorApi.getHealthDataForAnIndicator(
      apiRequestParams,
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  return (
    <ViewsWrapper areaCodes={areaCodes} indicatorsDataForAreas={[healthData]}>
      <OneIndicatorOneAreaViewPlots
        key={`OneIndicatorOneAreaViewPlots-${JSON.stringify(searchState)}`}
        indicatorData={healthData}
        indicatorMetadata={selectedIndicatorsData?.[0]}
      />
    </ViewsWrapper>
  );
}
