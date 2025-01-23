import { SearchResults } from '@/components/pages/results';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import { connection } from 'next/server';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { AreasApi } from '@/generated-sources/ft-api-client';
import { ErrorPage } from '@/components/pages/error';
import { getSearchService } from '@/lib/search/searchResultData';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator =
    searchParams?.[SearchParams.SearchedIndicator] ?? '';
  const indicatorsSelected = asArray(
    searchParams?.[SearchParams.IndicatorsSelected]
  );

  try {
    // Perform async API call using indicator prop
    await connection();

    const config = getApiConfiguration();
    const areasApi = new AreasApi(config);

    // const availableAreaTypes = await areasApi.getAreaTypes();

    // When DHSCFT-210 is complete The following try catch can be removed
    // and the line above uncommented as part of DHSCFT-211 to check FE against the API
    let availableAreaTypes: string[];
    try {
      availableAreaTypes = await areasApi.getAreaTypes();
    } catch (error) {
      console.log(`Error from areasApi ${error}`);

      availableAreaTypes = [];
    }

    const initialState = {
      searchedIndicator,
      indicatorsSelected,
      message: null,
      errors: {},
    };

    // Perform async API call using indicator prop
    const searchResults =
      await getSearchService().searchWith(searchedIndicator);
    return (
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={searchResults}
        availableAreaTypes={availableAreaTypes}
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
