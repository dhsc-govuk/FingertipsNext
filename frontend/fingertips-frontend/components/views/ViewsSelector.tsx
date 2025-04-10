import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { SearchStateParams } from '@/lib/searchStateManager';
import OneIndicatorTwoOrMoreAreasView from './OneIndicatorTwoOrMoreAreasView';
import TwoOrMoreIndicatorsAreasView from './TwoOrMoreIndicatorsAreasView';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import TwoOrMoreIndicatorsEnglandView from './TwoOrMoreIndicatorsEnglandView';
import { JSX } from 'react';
import { IndicatorDocument } from '@/lib/search/searchTypes';

interface ViewsSelectorProps {
  areaCodes: string[];
  indicators: string[];
  searchState: SearchStateParams;
  selectedIndicatorsData?: IndicatorDocument[];
}

export const ViewsSelector = ({
  areaCodes,
  indicators,
  searchState,
  selectedIndicatorsData,
}: ViewsSelectorProps): JSX.Element => {
  if (indicators.length === 1 && areaCodes.length === 1) {
    return (
      <OneIndicatorOneAreaView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={searchState}
      />
    );
  }

  if (indicators.length === 1 && areaCodes.length >= 2) {
    return (
      <OneIndicatorTwoOrMoreAreasView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={searchState}
      />
    );
  }

  if (
    indicators.length >= 2 &&
    areaCodes.length === 1 &&
    areaCodes[0] === areaCodeForEngland
  ) {
    return (
      <TwoOrMoreIndicatorsEnglandView
        searchState={searchState}
        selectedIndicatorsData={selectedIndicatorsData}
      />
    );
  }

  if (indicators.length >= 2 && areaCodes.length >= 1) {
    return (
      <TwoOrMoreIndicatorsAreasView
        searchState={searchState}
        selectedIndicatorsData={selectedIndicatorsData}
      />
    );
  }

  throw new Error('Parameters do not match any known view');
};
