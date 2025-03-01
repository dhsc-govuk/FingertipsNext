import { SearchResults } from '@/components/pages/results';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ErrorPage } from '@/components/pages/error';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { determineSelectedAreaType } from '@/lib/areaFilterHelpers/determineSelectedAreaType';
import { determineApplicableGroupTypes } from '@/lib/areaFilterHelpers/determineApplicableGroupTypes';
import { determineSelectedGroupType } from '@/lib/areaFilterHelpers/determineSelectedGroupType';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import { IndicatorSelectionState } from '@/components/forms/IndicatorSelectionForm/indicatorSelectionActions';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';

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
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.GroupSelected]: selectedGroup,
  } = stateManager.getSearchState();
  try {
    await connection();
    const areasApi = ApiClientFactory.getAreasApiClient();

    const availableAreaTypes = await areasApi.getAreaTypes();

    const selectedAreasData =
      areasSelected && areasSelected.length > 0
        ? await Promise.all(
            areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
          )
        : [];

    const determinedSelectedAreaType = determineSelectedAreaType(
      selectedAreaType as AreaTypeKeys,
      selectedAreasData
    );
    stateManager.addParamValueToState(
      SearchParams.AreaTypeSelected,
      determinedSelectedAreaType
    );

    const availableGroupTypes: AreaType[] | undefined =
      determineApplicableGroupTypes(
        availableAreaTypes,
        determinedSelectedAreaType
      );

    const determinedSelectedGroupType = determineSelectedGroupType(
      selectedGroupType as AreaTypeKeys
    );
    stateManager.addParamValueToState(
      SearchParams.GroupTypeSelected,
      determinedSelectedGroupType
    );

    const availableGroups = await areasApi.getAreaTypeMembers({
      areaTypeKey: determinedSelectedGroupType,
    });

    const determinedSelectedGroup = determineSelectedGroup(
      selectedGroup,
      availableGroups
    );
    stateManager.addParamValueToState(
      SearchParams.GroupSelected,
      determinedSelectedGroup
    );

    const availableArea: AreaWithRelations = await areasApi.getArea({
      areaCode: determinedSelectedGroup,
      includeChildren: true,
      childAreaType: determinedSelectedAreaType,
    });
    const availableAreas = availableArea ? availableArea.children : [];

    const searchResults = searchedIndicator
      ? await SearchServiceFactory.getIndicatorSearchService().searchWith(
          searchedIndicator,
          areasSelected
        )
      : [];

    const sortedByLevelAreaTypes = availableAreaTypes?.toSorted(
      (a, b) => a.level - b.level
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
        availableAreaTypes={sortedByLevelAreaTypes}
        availableAreas={availableAreas}
        availableGroupTypes={availableGroupTypes}
        availableGroups={availableGroups}
        selectedAreasData={selectedAreasData}
        searchState={stateManager.getSearchState()}
        currentDate={new Date()}
      />
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return (
      <ErrorPage
        errorText="An error has been returned by the service. Please try again."
        errorLink="/"
        errorLinkText="Return to Search"
      />
    );
  }
}
