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
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

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
  } = stateManager.getSearchState();
  try {
    await connection();

    const areasApi = ApiClientFactory.getAreasApiClient();

    const selectedAreasData =
      areasSelected && areasSelected.length > 0
        ? await Promise.all(
            areasSelected.map((area) =>
              areasApi.getArea(
                { areaCode: area },
                { next: { revalidate: 3600 } }
              )
            )
          )
        : [];

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

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    const searchResults = searchedIndicator
      ? await SearchServiceFactory.getIndicatorSearchService().searchWith(
          searchedIndicator,
          areasSelected
        )
      : [];

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
