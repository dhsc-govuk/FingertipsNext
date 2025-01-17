import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Home } from '@/components/pages/home';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator =
    searchParams?.[SearchParams.SearchedIndicator] ?? '';
  const initialState = {
    indicator: searchedIndicator,
    message: null,
    errors: {},
  };

  return (
    <>
      <Home searchFormState={initialState} />
    </>
  );
}
