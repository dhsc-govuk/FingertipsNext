import { SearchResults } from '@/components/pages/search/results';

export default async function Page(props: {
  searchParams?: Promise<{
    indicator?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator || '';

  return <SearchResults indicator={indicator} />;
}
