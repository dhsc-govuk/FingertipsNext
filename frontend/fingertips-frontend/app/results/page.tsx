import { SearchResults } from '@/components/pages/results';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import { connection } from 'next/server';
import { ErrorPage } from '@/components/pages/error';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import { SearchResultState } from '@/components/pages/results/searchResultsActions';

const determineSelectedAreaType = (
  selectedAreaType?: string,
  selectedAreaData?: AreaWithRelations[],
  availableAreaTypes?: AreaType[]
): string | undefined => {
  if (selectedAreaType) return selectedAreaType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].areaType;

  if (availableAreaTypes && availableAreaTypes.length > 0)
    return availableAreaTypes[0].name;
};

const determineGroupType = (
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
  } = stateManager.getSearchState();

  try {
    // Perform async API call using indicator prop
    await connection();
    const areasApi = ApiClientFactory.getAreasApiClient();

    let availableAreas: Area[] = [];

    const availableAreaTypes = await areasApi.getAreaTypes();
    const selectedAreasData =
      areasSelected && areasSelected.length > 0
        ? await Promise.all(
            areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
          )
        : [];

    const selectedAreaType2 = determineSelectedAreaType(
      selectedAreaType,
      selectedAreasData,
      availableAreaTypes
    );
    if (selectedAreaType2) {
      availableAreas = await areasApi.getAreaTypeMembers({
        areaType: selectedAreaType2,
      });
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
