import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  allowedAreaTypeMapMetaKeys,
  AreaTypeKeysForMapMeta,
  getMapGeographyData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
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
    true
  );

  const indicatorDataAvailableAreas = {
    ...indicatorDataIncludingEmptyAreas,
    areaHealthData: indicatorDataIncludingEmptyAreas.areaHealthData?.filter(
      (area) => area.healthData.length
    ),
  };

  const indicatorMetadata = selectedIndicatorsData?.[0];
  const mapGeographyData =
    selectedGroupArea === ALL_AREAS_SELECTED &&
    allowedAreaTypeMapMetaKeys.includes(
      selectedAreaType as AreaTypeKeysForMapMeta
    )
      ? await getMapGeographyData(
          selectedAreaType as AreaTypeKeysForMapMeta,
          areaCodes
        )
      : undefined;

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={[indicatorDataAvailableAreas]}
    >
      <OneIndicatorTwoOrMoreAreasViewPlots
        indicatorData={indicatorDataAvailableAreas}
        searchState={searchState}
        indicatorMetadata={indicatorMetadata}
        mapGeographyData={mapGeographyData}
        indicatorDataAllAreas={indicatorDataIncludingEmptyAreas}
      />
    </ViewsWrapper>
  );
}
