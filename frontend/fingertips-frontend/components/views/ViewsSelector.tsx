import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
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
  const updatedSearchState = {
    ...searchState,
    [SearchParams.AreasSelected]: areaCodes,
  };

  if (indicators.length === 1 && areaCodes.length === 1) {
    return (
      <OneIndicatorOneAreaView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={updatedSearchState}
      />
    );
  }

  if (indicators.length === 1 && areaCodes.length >= 2) {
    return (
      <OneIndicatorTwoOrMoreAreasView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={updatedSearchState}
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
        searchState={updatedSearchState}
        selectedIndicatorsData={selectedIndicatorsData}
      />
    );
  }

  if (indicators.length >= 2 && areaCodes.length >= 1) {
    return (
      <TwoOrMoreIndicatorsAreasView
        searchState={updatedSearchState}
        selectedIndicatorsData={selectedIndicatorsData}
      />
    );
  }

  throw new Error('Parameters do not match any known view');
};
