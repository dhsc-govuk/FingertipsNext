import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import OneIndicatorTwoOrMoreAreasView from './OneIndicatorTwoOrMoreAreasView';

type ViewsContextProps = {
  searchState: SearchStateParams;
};

function viewSelector(
  areaCodes: string[],
  indicators: string[],
  searchState: SearchStateParams
) {
  if (areaCodes.length === 1 && indicators.length === 1) {
    return <OneIndicatorOneAreaView searchState={searchState} />;
  }
  if (areaCodes.length >= 2 && indicators.length === 1) {
    return <OneIndicatorTwoOrMoreAreasView searchState={searchState} />;
  }
}

export function ViewsContext({ searchState }: ViewsContextProps) {
  // determine which view is needed
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelecteds,
    [SearchParams.AreasSelected]: areasSelected,
    // [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelecteds ?? [];

  return (
    <>
      <>Backlink</>
      {viewSelector(areaCodes, indicators, searchState)}
    </>
  );
}
