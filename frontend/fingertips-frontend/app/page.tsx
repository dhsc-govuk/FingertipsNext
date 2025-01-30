import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Home } from '@/components/pages/home';
import { getArea } from '@/components/forms/SearchForm/searchActions';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator =
    searchParams?.[SearchParams.SearchedIndicator] ?? '';
  const selectedAreaCode =
    searchParams?.[SearchParams.AreasSelected] ?? undefined;
  const areaDocument = selectedAreaCode
    ? await getArea(selectedAreaCode as string)
    : undefined;

  const initialState = {
    indicator: searchedIndicator,
    areaSelected: areaDocument,
    message: null,
    errors: {},
  };

  return <Home searchFormState={initialState} />;
}
