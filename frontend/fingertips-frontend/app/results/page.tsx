import { SearchResults } from '@/components/pages/results';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ErrorPage } from '@/components/pages/error';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorSelectionState } from '@/components/forms/IndicatorSelectionForm/indicatorSelectionActions';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { getSelectedAreasDataByAreaType } from '@/lib/areaFilterHelpers/getSelectedAreasData';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;

  const stateManager = SearchStateManager.initialise(searchParams);

  const {
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.GroupSelected]: groupSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = stateManager.getSearchState();
  try {
    await connection();

    const selectedAreasData = await getSelectedAreasDataByAreaType(
      areasSelected,
      areaTypeSelected as AreaTypeKeys
    );

    const {
      availableAreaTypes,
      availableAreas,
      availableGroupTypes,
      availableGroups,
      updatedSearchState,
    } = await getAreaFilterData(
      stateManager.getSearchState(),
      selectedAreasData
    );
    const isEnglandSelectedAsGroup = groupSelected === areaCodeForEngland;

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    if (
      searchedIndicator &&
      searchedIndicator.length > INDICATOR_SEARCH_MAX_CHARACTERS
    ) {
      stateManager.addParamValueToState(
        SearchParams.SearchedIndicator,
        searchedIndicator.slice(0, INDICATOR_SEARCH_MAX_CHARACTERS)
      );
    }

    const searchFilterAreas =
      groupAreaSelected === ALL_AREAS_SELECTED
        ? availableAreas?.map((area) => area.code)
        : areasSelected;

    const searchResults =
      await SearchServiceFactory.getIndicatorSearchService().searchWith(
        searchedIndicator?.slice(0, INDICATOR_SEARCH_MAX_CHARACTERS) ?? '',
        isEnglandSelectedAsGroup,
        searchFilterAreas
      );

    const initialState: IndicatorSelectionState = {
      searchState: JSON.stringify(stateManager.getSearchState()),
      indicatorsSelected: indicatorsSelected ?? [],
      message: null,
      errors: {},
    };

    return (
      <SearchResults
        initialIndicatorSelectionState={initialState}
        searchResults={searchResults}
        areaFilterData={{
          availableAreaTypes,
          availableGroupTypes,
          availableGroups,
          availableAreas,
        }}
        isEnglandSelectedAsGroup={isEnglandSelectedAsGroup}
        selectedAreasData={selectedAreasData}
        currentDate={new Date()}
      />
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return <ErrorPage />;
  }
}
