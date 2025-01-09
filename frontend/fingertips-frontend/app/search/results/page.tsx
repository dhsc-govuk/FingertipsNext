import { SearchResults } from '@/components/pages/search/results';
import { getSearchData } from './search-result-data';
import { SearchStateParams } from '@/lib/searchStateManager';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.searchedIndicator ?? '';
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];

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
