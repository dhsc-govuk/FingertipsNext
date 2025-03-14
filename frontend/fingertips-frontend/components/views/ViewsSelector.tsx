import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { SearchStateParams } from '@/lib/searchStateManager';
import OneIndicatorTwoOrMoreAreasView from './OneIndicatorTwoOrMoreAreasView';
import TwoOrMoreIndicatorsAreasView from './TwoOrMoreIndicatorsAreasView';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import TwoOrMoreIndicatorsEnglandView from './TwoOrMoreIndicatorsEnglandView';
import { JSX } from 'react';

interface ViewsSelectorProps {
  areaCodes: string[];
  indicators: string[];
  searchState: SearchStateParams;
}

export const ViewsSelector = ({
  areaCodes,
  indicators,
  searchState,
}: ViewsSelectorProps): JSX.Element => {
  if (indicators.length === 1 && areaCodes.length >= 1) {
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
  return <></>;
};
