import { SearchForm } from '@/components/forms/SearchForm';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      indicator?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const indicator = searchParams?.indicator ?? '';

  return <SearchForm indicator={indicator} />;
}
