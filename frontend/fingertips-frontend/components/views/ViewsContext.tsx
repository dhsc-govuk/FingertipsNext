import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { ViewsSelector } from './ViewsSelector';

export type ViewProps = {
  searchState: SearchStateParams;
};

export function ViewsContext({ searchState }: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelected ?? [];

  return (
    <ViewsSelector
      areaCodes={areaCodes}
      indicators={indicators}
      searchState={searchState}
    />
  );
}
