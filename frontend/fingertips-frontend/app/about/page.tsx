import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { About } from '@/components/pages/about';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;

  const stateManager = SearchStateManager.initialise(searchParams);

  return <About searchState={stateManager.getSearchState()} />;
}
