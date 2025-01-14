import { SearchResults } from '@/components/pages/results';
import { getSearchData } from './search-result-data';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
      indicatorsSelected?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';
  const indicatorsSelected = searchParams?.indicatorsSelected?.split(',') ?? [];

  // Perform async API call using indicator prop
  const searchResults = getSearchData();

  const initialState = {
    indicator: indicator,
    indicatorsSelected: indicatorsSelected,
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
