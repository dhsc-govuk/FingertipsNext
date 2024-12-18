import { SearchResults } from '@/components/pages/search/results';
import { getSearchService } from '@/lib/search/searchResultData';

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
  const searchResults = await getSearchService().searchByIndicator(indicator);

  return <SearchResults indicator={indicator} searchResults={searchResults} />;
}
