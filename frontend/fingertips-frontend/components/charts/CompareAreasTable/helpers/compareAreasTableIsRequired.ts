import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

export const compareAreasTableIsRequired = (searchState: SearchStateParams) => {
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds,
    [SearchParams.AreasSelected]: selectedAreas,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;
  if (!indicatorIds || indicatorIds.length === 0) return false;
  if (groupAreaSelected === ALL_AREAS_SELECTED) return true;
  if (!selectedAreas || selectedAreas.length === 0) return false;
  return selectedAreas.length >= 2;
};
