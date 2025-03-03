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
import { JSX } from 'react';

export type ViewProps = {
  searchState: SearchStateParams;
};

function viewSelector(
  areaCodes: string[],
  indicators: string[],
  searchState: SearchStateParams
): JSX.Element {
  if (indicators.length === 1 && areaCodes.length === 1) {
    return <OneIndicatorOneAreaView searchState={searchState} />;
  }

  if (indicators.length === 1 && areaCodes.length >= 2) {
    return <OneIndicatorTwoOrMoreAreasView searchState={searchState} />;
  }

  if (
    indicators.length >= 2 &&
    areaCodes.length === 1 &&
    areaCodes[0] === areaCodeForEngland
  ) {
    return <TwoOrMoreIndicatorsEnglandView searchState={searchState} />;
  }

  return <TwoOrMoreIndicatorsAreasView searchState={searchState} />;
}

export function ViewsContext({ searchState }: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelected ?? [];

  return viewSelector(areaCodes, indicators, searchState);
}
