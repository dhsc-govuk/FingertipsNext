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
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
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
    return (
      <OneIndicatorTwoOrMoreAreasView
        searchState={searchState}
        areaCodes={areaCodes}
      />
    );
  }

  if (
    indicators.length >= 2 &&
    areaCodes.length === 1 &&
    areaCodes[0] === areaCodeForEngland
  ) {
    return <TwoOrMoreIndicatorsEnglandView searchState={searchState} />;
  }

  if (indicators.length >= 2 && areaCodes.length >= 1) {
    return (
      <TwoOrMoreIndicatorsAreasView
        searchState={searchState}
        areaCodes={areaCodes}
      />
    );
  }

  throw new Error('Parameters do not match any known view');
}

export function ViewsContext({
  searchState,
  areaFilterData,
  selectedAreasData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = stateManager.getSearchState();
  const indicators = indicatorsSelected ?? [];

  let areaCodes;
  if (groupAreaSelected === ALL_AREAS_SELECTED) {
    areaCodes =
      areaFilterData?.availableAreas?.map((area) => {
        return area.code;
      }) ?? [];
  } else {
    areaCodes = areasSelected ?? [];
  }

  return (
    <ChartPageWrapper
      searchState={searchState}
      areaFilterData={areaFilterData}
      selectedAreasData={selectedAreasData}
    >
      {viewSelector(areaCodes, indicators, searchState)}
    </ChartPageWrapper>
  );
}
