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
import { AreaFilterData } from '../molecules/SelectAreasFilterPanel';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
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

  if (indicators.length >= 2 && areaCodes.length >= 1) {
    return <TwoOrMoreIndicatorsAreasView searchState={searchState} />;
  }

  throw new Error('Parameters do not match any known view');
}

export function ViewsContext({
  searchState,
  areaFilterData,
}: Readonly<ViewProps>) {
  console.log(`areaFilterData ${areaFilterData}`);
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelected ?? [];

  return viewSelector(areaCodes, indicators, searchState);
}
