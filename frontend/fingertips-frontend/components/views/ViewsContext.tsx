import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { AreaFilterData } from '../molecules/SelectAreasFilterPanel';
import { ChartPageWrapper } from '../pages/chartPageWrapper';
import { Area } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ViewsSelector } from './ViewsSelector';
import { PopulationPyramidWithTableDataProvider } from '@/app/chart/PopulationPyramidWithTableDataProvider';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: Area[];
  selectedIndicatorsData?: IndicatorDocument[];
  availableAreas?: Area[];
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
    areasSelected,
    groupAreaSelected,
    areaFilterData?.availableAreas
  );

  return (
    <ChartPageWrapper
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
        availableAreas={areaFilterData?.availableAreas}
      />
      <PopulationPyramidWithTableDataProvider
        areaCodes={areaCodes}
        searchState={searchState}
      />
    </ChartPageWrapper>
  );
}
