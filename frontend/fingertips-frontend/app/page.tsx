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
            areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
          )
        : [];

    const initialState: SearchFormState = {
      indicator: searchedIndicator ?? '',
      areaSearched: areasSelected ? areasSelected[0] : '',
      message: null,
      errors: {},
    };

    return (
      <Home
        initialFormState={initialState}
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
