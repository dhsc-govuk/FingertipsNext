import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';

export default async function OneIndicatorOneAreaView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
    [SearchParams.LineChartBenchmarkAreaSelected]: lineChartAreaSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(areasSelected);

  if (areaCodes?.length !== 1 || indicatorSelected?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areaCodes];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const areaTypeToUse =
    areaCodes[0] === areaCodeForEngland
      ? englandAreaType.key
      : areaTypeSelected;

  const benchmarkRefType = determineBenchmarkRefType(lineChartAreaSelected);

  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  try {
    indicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: areaCodesToRequest,
        inequalities: [
          GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
          GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
        ],
        areaType: areaTypeToUse,
        benchmarkRefType,
        areaGroup:
          benchmarkRefType === 'AreaGroup' ? selectedGroupCode : undefined,
      },
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  return (
    <ViewsWrapper
      areaCodes={areaCodes}
      indicatorsDataForAreas={[indicatorData]}
    >
      <OneIndicatorOneAreaViewPlots
        key={`OneIndicatorOneAreaViewPlots-${JSON.stringify(searchState)}`}
        indicatorData={indicatorData}
        searchState={searchState}
        indicatorMetadata={selectedIndicatorsData?.[0]}
      />
    </ViewsWrapper>
  );
}
