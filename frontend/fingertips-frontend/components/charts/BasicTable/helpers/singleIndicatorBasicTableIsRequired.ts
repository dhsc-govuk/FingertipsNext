import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const singleIndicatorBasicTableIsRequired = (
  searchState: SearchStateParams
) => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;
  if (areasSelected?.at(0) === areaCodeForEngland) return true;
  if (areaTypeSelected === 'england') return true;
  if (groupAreaSelected === ALL_AREAS_SELECTED) return false;
  return areasSelected?.length === 0;
};
