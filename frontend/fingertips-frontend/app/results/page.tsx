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
import { Area, AreaType } from '@/generated-sources/ft-api-client';
import { SearchResultState } from '@/components/pages/results/searchResultsActions';
import { determineSelectedAreaType } from '@/lib/areaFilterHelpers/determineSelectedAreaType';
import { determineApplicableGroupTypes } from '@/lib/areaFilterHelpers/determineApplicableGroupTypes';
import { determineSelectedGroupType } from '@/lib/areaFilterHelpers/determineSelectedGroupType';
import { AreaTypes } from '@/mock/data/areaType';

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
      selectedAreaType as AreaTypes,
      selectedAreasData
    );
    stateManager.addParamValueToState(
      SearchParams.AreaTypeSelected,
      determinedSelectedAreaType
    );

    const availableAreas: Area[] = await areasApi.getAreaTypeMembers({
      areaTypeKey: determinedSelectedAreaType,
    });

    const availableGroupTypes: AreaType[] | undefined =
      determineApplicableGroupTypes(
        availableAreaTypes,
        determinedSelectedAreaType
      );

    const determinedSelectedGroupType = determineSelectedGroupType(
      selectedGroupType as AreaTypes,
      selectedAreasData
    );
    if (determinedSelectedGroupType) {
      stateManager.addParamValueToState(
        SearchParams.GroupTypeSelected,
        determinedSelectedGroupType
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
        errorLink="/"
        errorLinkText="Return to Search"
      />
    );
  }
}
