import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import {
  determineBenchmarkRefType,
  getIndicatorData,
} from '@/lib/ViewsHelpers';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

export default async function OneIndicatorTwoOrMoreAreasView({
  selectedIndicatorsData,
  searchState,
  availableAreas,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.LineChartBenchmarkAreaSelected]: lineChartAreaSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(
    areasSelected,
    selectedGroupArea,
    availableAreas
  );

  if (indicatorSelected?.length !== 1 || !areaCodes || areaCodes?.length < 2) {
    throw new Error('Invalid parameters provided to view');
  }

  await connection();

  const indicatorsAndAreas = {
    areasSelected: areaCodes,
    indicatorSelected,
    selectedAreaType,
    selectedGroupCode,
    selectedGroupType,
  };

  const benchmarkRefType = determineBenchmarkRefType(lineChartAreaSelected);

  const indicatorDataAllAreas = await getIndicatorData(
    indicatorsAndAreas,
    benchmarkRefType,
    areaCodes.length > 2
  );

  const indicatorDataAvailableAreas = {
    ...indicatorDataAllAreas,
    areaHealthData: indicatorDataAllAreas.areaHealthData,
  } satisfies IndicatorWithHealthDataForArea;

  const indicatorMetadata = selectedIndicatorsData?.[0];
  return (
    <ViewsWrapper
      areaCodes={areaCodes}
      indicatorsDataForAreas={[indicatorDataAvailableAreas]}
    >
      <OneIndicatorTwoOrMoreAreasViewPlots
        areaCodes={areaCodes}
        indicatorData={indicatorDataAvailableAreas}
        searchState={searchState}
        indicatorMetadata={indicatorMetadata}
        indicatorDataAllAreas={indicatorDataAllAreas}
      />
    </ViewsWrapper>
  );
}
