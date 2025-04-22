import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { getIndicatorData } from '@/lib/ViewsHelpers';

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

  const indicatorDataIncludingEmptyAreas = await getIndicatorData(
    indicatorsAndAreas,
    true,
    areaCodes.length > 2
  );

  const indicatorDataAvailableAreas = {
    ...indicatorDataIncludingEmptyAreas,
    areaHealthData: indicatorDataIncludingEmptyAreas.areaHealthData?.filter(
      (area) => area.healthData.length
    ),
  };

  const indicatorMetadata = selectedIndicatorsData?.[0];
  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={[indicatorDataAvailableAreas]}
    >
      <OneIndicatorTwoOrMoreAreasViewPlots
        areaCodes={areaCodes}
        indicatorData={indicatorDataAvailableAreas}
        searchState={searchState}
        indicatorMetadata={indicatorMetadata}
        indicatorDataAllAreas={indicatorDataIncludingEmptyAreas}
      />
    </ViewsWrapper>
  );
}
