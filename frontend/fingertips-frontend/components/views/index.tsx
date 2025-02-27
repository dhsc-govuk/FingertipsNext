import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import OneIndicatorTwoOrMoreAreasView from './OneIndicatorTwoOrMoreAreasView';
import TwoOrMoreIndicatorsAreasView from './TwoOrMoreIndicatorsAreasView';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import TwoOrMoreIndicatorsEnglandView from './TwoOrMoreIndicatorsEnglandView';

type ViewsContextProps = {
  searchState: SearchStateParams;
};

function viewSelector(
  areaCodes: string[],
  indicators: string[],
  searchState: SearchStateParams
) {
  if (indicators.length === 1) {
    if (areaCodes.length === 1) {
      return <OneIndicatorOneAreaView searchState={searchState} />;
    } else if (areaCodes.length >= 2) {
      return <OneIndicatorTwoOrMoreAreasView searchState={searchState} />;
    }
  } else if (indicators.length >= 2) {
    // TODO: add special case for England
    if (areaCodes.length === 1 && areaCodes[0] === areaCodeForEngland) {
      return <TwoOrMoreIndicatorsEnglandView searchState={searchState} />;
    }
    return <TwoOrMoreIndicatorsAreasView searchState={searchState} />;
  }
}

export function ViewsContext({ searchState }: Readonly<ViewsContextProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    // [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelected ?? [];

  return (
    <>
      <>Backlink</>
      {viewSelector(areaCodes, indicators, searchState)}
    </>
  );
}
