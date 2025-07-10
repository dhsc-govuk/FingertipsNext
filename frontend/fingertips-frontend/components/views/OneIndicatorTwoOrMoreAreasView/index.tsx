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
import { auth } from '@/lib/auth';

export default async function OneIndicatorTwoOrMoreAreasView({
  searchState,
  availableAreas,
}: Readonly<ViewProps>) {
  const session = await auth();
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
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

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);

  const indicatorData = await getIndicatorData(
    indicatorsAndAreas,
    benchmarkRefType,
    areaCodes.length > 2
  );

  return (
    <ViewsWrapper
      areaCodes={areaCodes}
      indicatorsDataForAreas={[indicatorData]}
    >
      <OneIndicatorTwoOrMoreAreasViewPlots
        indicatorData={indicatorData}
        session={session}
      />
    </ViewsWrapper>
  );
}
