import { SearchResults } from '@/components/pages/results';
import { getSearchData } from './search-result-data';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import { connection } from 'next/server';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { AreasApi } from '@/generated-sources/ft-api-client';

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

  // Perform async API call using indicator prop
  await connection();

  const config = getApiConfiguration();
  const areasApi = new AreasApi(config);
  const availableAreaTypes = await areasApi.getAreaTypes();

  const searchResults = getSearchData();

  const initialState = {
    searchedIndicator,
    indicatorsSelected,
    message: null,
    errors: {},
  };

  return (
    <SearchResults
      searchResultsFormState={initialState}
      searchResults={searchResults}
      availableAreaTypes={availableAreaTypes}
    />
  );
}