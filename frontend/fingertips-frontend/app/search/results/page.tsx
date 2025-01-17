import { SearchResults } from '@/components/pages/search/results';
import { getSearchData } from './search-result-data';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';

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
    />
  );
}
