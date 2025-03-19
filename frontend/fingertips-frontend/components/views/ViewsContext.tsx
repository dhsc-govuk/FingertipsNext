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
import { ChartPageWrapper } from '../pages/chartPageWrapper';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
};

function viewSelector(
  areaCodes: string[],
  indicators: string[],
  searchState: SearchStateParams
): JSX.Element {
  const determinedAreaCodes =
    areaCodes.length > 0 ? areaCodes : [areaCodeForEngland];

  const updatedSearchState = {
    ...searchState,
    [SearchParams.AreasSelected]: determinedAreaCodes,
  };

  if (indicators.length === 1 && determinedAreaCodes.length === 1) {
    return <OneIndicatorOneAreaView searchState={updatedSearchState} />;
  }

  if (indicators.length === 1 && determinedAreaCodes.length >= 2) {
    return <OneIndicatorTwoOrMoreAreasView searchState={updatedSearchState} />;
  }

  if (
    indicators.length >= 2 &&
    determinedAreaCodes.length === 1 &&
    determinedAreaCodes[0] === areaCodeForEngland
  ) {
    return <TwoOrMoreIndicatorsEnglandView searchState={updatedSearchState} />;
  }

  if (indicators.length >= 2 && determinedAreaCodes.length >= 1) {
    return <TwoOrMoreIndicatorsAreasView searchState={updatedSearchState} />;
  }

  throw new Error('Parameters do not match any known view');
}

export function ViewsContext({
  searchState,
  areaFilterData,
  selectedAreasData,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const areaCodes = areasSelected ?? [];
  const indicators = indicatorsSelected ?? [];

  return (
    <ChartPageWrapper
      key={JSON.stringify(searchState)}
      searchState={searchState}
      areaFilterData={areaFilterData}
      selectedAreasData={selectedAreasData}
      selectedIndicatorsData={selectedIndicatorsData}
    >
      {viewSelector(areaCodes, indicators, searchState)}
    </ChartPageWrapper>
  );
}
