import { SearchResults } from '@/components/pages/search/results';
import { ErrorPage } from '@/components/pages/error';
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

  try {
    // Perform async API call using indicator prop
    const searchResults = await getSearchService().searchWith(indicator);
    return (
      <SearchResults indicator={indicator} searchResults={searchResults} />
    );
  } catch (error) {
    // Log error response
    // TBC
    console.log(
      `Error response received from call to Search service: ${error}`
    );
    return (
      <ErrorPage
        errorText="An error has been returned by the search service. Please try again."
        errorLink="/search"
        errorLinkText="Return to Search"
      />
    );
  }
}
