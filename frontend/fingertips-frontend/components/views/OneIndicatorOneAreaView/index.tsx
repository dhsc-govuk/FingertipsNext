import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import { getAuthorisedHealthDataForAnIndicator } from '@/lib/chartHelpers/getAuthorisedHealthDataForAnIndicator';

export default async function OneIndicatorOneAreaView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
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

  const areaTypeToUse =
    areaCodes[0] === areaCodeForEngland
      ? englandAreaType.key
      : areaTypeSelected;

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);

  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  const requestParams = {
    indicatorId: Number(indicatorSelected[0]),
    areaCodes: areaCodesToRequest,
    inequalities: [
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
    ],
    areaType: areaTypeToUse,
    benchmarkRefType,
    ancestorCode:
      benchmarkRefType === BenchmarkReferenceType.SubNational
        ? selectedGroupCode
        : undefined,
  };
  try {
    indicatorData = await getAuthorisedHealthDataForAnIndicator(requestParams);
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
      />
    </ViewsWrapper>
  );
}
