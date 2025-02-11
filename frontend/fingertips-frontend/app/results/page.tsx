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
import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { SearchResultState } from '@/components/pages/results/searchResultsActions';
import { determineSelectedAreaType } from '@/lib/areaFilterHelpers/determineSelectedAreaType';
import {
  AllApplicableAreaTypes,
  determineApplicableGroupTypes,
} from '@/lib/areaFilterHelpers/determineApplicableGroupTypes';

const determineSelectedGroupType = (
  selectedGroupType?: string,
  selectedAreaData?: AreaWithRelations[]
): string | undefined => {
  if (selectedGroupType) return selectedGroupType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].parent?.areaType;
};

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;

  const stateManager =
    SearchStateManager.setStateFromSearchStateParams(searchParams);

  const {
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
  } = stateManager.getSearchState();

  try {
    // Perform async API call using indicator prop
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
      selectedAreaType,
      selectedAreasData,
      availableAreaTypes
    );

    let availableAreas: Area[] = [];
    if (determinedSelectedAreaType) {
      stateManager.addParamValueToState(
        SearchParams.AreaTypeSelected,
        determinedSelectedAreaType
      );

      availableAreas = await areasApi.getAreaTypeMembers({
        areaType: determinedSelectedAreaType,
      });
    }

    let availableGroupTypes: AllApplicableAreaTypes[] | undefined = [];
    const determinedSelectedGroupType = determineSelectedGroupType(
      selectedGroupType,
      selectedAreasData
    );
    if (determinedSelectedGroupType) {
      stateManager.addParamValueToState(
        SearchParams.GroupTypeSelected,
        determinedSelectedGroupType
      );
      availableGroupTypes = determineApplicableGroupTypes(
        availableAreaTypes,
        determinedSelectedAreaType
      );
    }

    const initialState: SearchResultState = {
      searchState: JSON.stringify(stateManager.getSearchState()),
      indicatorsSelected: indicatorsSelected ?? [],
      message: null,
      errors: {},
    };

    // Perform async API call using indicator prop
    const searchResults = searchedIndicator
      ? await SearchServiceFactory.getIndicatorSearchService().searchWith(
          searchedIndicator
        )
      : [];

    const sortedByLevelAreaTypes = availableAreaTypes?.toSorted(
      (a, b) => a.level - b.level
    );

    return (
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={searchResults}
        availableAreaTypes={sortedByLevelAreaTypes}
        availableAreas={availableAreas}
        availableGroupTypes={availableGroupTypes}
        selectedAreasData={selectedAreasData}
        searchState={stateManager.getSearchState()}
      />
    );
  } catch (error) {
    // Log error response
    console.log(`Error response received from call: ${error}`);
    return (
      <ErrorPage
        errorText="An error has been returned by the service. Please try again."
        errorLink="/search"
        errorLinkText="Return to Search"
      />
    );
  }
}
