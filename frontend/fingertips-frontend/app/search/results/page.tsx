import { SearchResults } from '@/components/pages/search/results';
import { getSearchData } from './search-result-data';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';

  // Perform async API call using indicator prop
  const searchResults = getSearchData();

  return <SearchResults indicator={indicator} searchResults={searchResults} />;
}
