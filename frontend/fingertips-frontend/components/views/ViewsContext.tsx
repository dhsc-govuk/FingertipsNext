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
import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
};

function viewSelector(
  areaCodes: string[],
  indicators: string[],
  searchState: SearchStateParams,
  selectedIndicatorsData?: IndicatorDocument[]
): JSX.Element {
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
    return <TwoOrMoreIndicatorsEnglandView searchState={updatedSearchState} />;
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
}

const determineAreaCodes = (
  groupAreaSelected?: string,
  areaSelected?: string[],
  availableAreas?: Area[]
): string[] => {
  if (groupAreaSelected === ALL_AREAS_SELECTED) {
    return (
      availableAreas?.map((area) => {
        return area.code;
      }) ?? []
    );
  }

  if (!areaSelected || areaSelected.length === 0) {
    return [areaCodeForEngland];
  }

  return areaSelected ?? [];
};

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
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = stateManager.getSearchState();
  const indicators = indicatorsSelected ?? [];

  const areaCodes = determineAreaCodes(
    groupAreaSelected,
    areasSelected,
    areaFilterData?.availableAreas
  );

  return (
    <ChartPageWrapper
      key={JSON.stringify(searchState)}
      searchState={searchState}
      areaFilterData={areaFilterData}
      selectedAreasData={selectedAreasData}
      selectedIndicatorsData={selectedIndicatorsData}
    >
      {viewSelector(areaCodes, indicators, searchState, selectedIndicatorsData)}
    </ChartPageWrapper>
  );
}
