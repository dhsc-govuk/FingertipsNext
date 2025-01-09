import { SearchForm } from '@/components/forms/SearchForm';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      searchedIndicator?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.searchedIndicator ?? '';
  const initialState = {
    indicator: searchedIndicator,
    message: null,
    errors: {},
  };

  return <SearchForm searchFormState={initialState} />;
}
