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
  const initialState = {
    indicator: indicator,
    message: null,
    errors: {},
  };

  return <SearchForm searchFormState={initialState} />;
}
