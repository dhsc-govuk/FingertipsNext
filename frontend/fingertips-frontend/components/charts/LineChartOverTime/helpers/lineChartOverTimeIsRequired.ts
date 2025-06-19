import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const lineChartOverTimeIsRequired = (searchState: SearchStateParams) => {
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(areasSelected);

  if (
    areaCodes?.length === 1 &&
    areaCodes?.at(0) === areaCodeForEngland &&
    areaTypeSelected === 'england'
  ) {
    return true;
  }

  if (groupAreaSelected === ALL_AREAS_SELECTED) return false;
  if (areaCodes?.length > 2) return false;
  if (indicatorIds?.length !== 1) return false;

  return Boolean(areaCodes.length > 0);
};
