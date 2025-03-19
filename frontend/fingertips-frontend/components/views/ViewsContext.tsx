import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import { AreaFilterData } from '../molecules/SelectAreasFilterPanel';
import { ChartPageWrapper } from '../pages/chartPageWrapper';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { ViewsSelector } from './ViewsSelector';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
};


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
      <ViewsSelector areaCodes={areaCodes} indicators={indicators} searchState={searchState} />
    </ChartPageWrapper>
  );
}
