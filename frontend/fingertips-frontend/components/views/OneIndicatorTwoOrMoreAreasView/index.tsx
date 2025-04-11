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
import { getIndicatorData } from '@/lib/ViewsHelpers';

export default async function OneIndicatorTwoOrMoreAreasView({
  selectedIndicatorsData,
  searchState,
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

  if (
    indicatorSelected?.length !== 1 ||
    !areasSelected ||
    areasSelected?.length < 2
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  await connection();

  const indicatorsAndAreas = {
    areasSelected,
    indicatorSelected,
    selectedAreaType,
    selectedGroupCode,
    selectedGroupType,
  };

  const indicatorDataAvailableAreas = await getIndicatorData(
    indicatorsAndAreas,
    false
  );

  // Additional call with empty areas included. Currently supported only by maps.
  // It is anticipated that as other components are able to handle empty healthdata[]
  // they will also use this data and the other indicator data call can be removed.
  const indicatorDataIncludingEmptyAreas = await getIndicatorData(
    indicatorsAndAreas,
    true
  );

  const indicatorMetadata = selectedIndicatorsData?.[0];
  const mapGeographyData =
    selectedGroupArea === ALL_AREAS_SELECTED &&
    allowedAreaTypeMapMetaKeys.includes(
      selectedAreaType as AreaTypeKeysForMapMeta
    )
      ? await getMapGeographyData(
          selectedAreaType as AreaTypeKeysForMapMeta,
          areasSelected
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
