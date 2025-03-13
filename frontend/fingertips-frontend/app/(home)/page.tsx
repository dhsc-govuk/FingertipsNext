import { Home } from '@/components/pages/home';

import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { ErrorPage } from '@/components/pages/error';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';

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

    const initialState: SearchFormState = {
      indicator: searchedIndicator ?? '',
      searchState: JSON.stringify(stateManager.getSearchState()),
      message: null,
      errors: {},
    };

    return (
      <Home
        initialFormState={initialState}
        areaFilterData={{
          availableAreaTypes,
          availableGroupTypes,
          availableGroups,
          availableAreas,
        }}
        selectedAreasData={selectedAreasData}
        searchState={stateManager.getSearchState()}
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
