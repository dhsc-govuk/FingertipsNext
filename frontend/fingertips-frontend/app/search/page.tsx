import { SearchForm } from '@/components/forms/SearchForm';
import { SearchStateParams } from '@/lib/searchStateManager';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
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
