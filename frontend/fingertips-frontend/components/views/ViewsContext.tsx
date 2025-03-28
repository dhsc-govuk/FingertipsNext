import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

import { AreaFilterData } from '../molecules/SelectAreasFilterPanel';
import { ChartPageWrapper } from '../pages/chartPageWrapper';
import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { ViewsSelector } from './ViewsSelector';
import { PyramidContextProvider } from '@/app/chart/PyramidContextProvider';

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

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
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
      <ViewsSelector
        areaCodes={areaCodes}
        indicators={indicators}
        searchState={searchState}
        selectedIndicatorsData={selectedIndicatorsData}
      />

      <PyramidContextProvider
        areaCodes={areaCodes}
        searchState={searchState}
      />
    </ChartPageWrapper>
  );
}
