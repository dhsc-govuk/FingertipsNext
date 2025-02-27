import { Home } from '@/components/pages/home';

import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const stateManager = SearchStateManager.initialise(searchParams);
  const {
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();

  const initialState: SearchFormState = {
    indicator: searchedIndicator ?? '',
    areaSearched: areasSelected ? areasSelected[0] : '',
    message: null,
    errors: {},
  };

  return (
    <Home
      initialFormState={initialState}
      searchState={stateManager.getSearchState()}
    />
  );
}
