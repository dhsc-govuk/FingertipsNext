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
    areaCodes.length === 1 &&
    areaCodes[0] === areaCodeForEngland &&
    areaTypeSelected === 'england'
  ) {
    // yes if ONLY england
    return true;
  }

  if (groupAreaSelected === ALL_AREAS_SELECTED) return false; // not if all areas
  if (areaCodes.length > 2) return false; // not if more than 2 areas
  if (indicatorIds?.length !== 1) return false; // not if we don't have exactly 1 indicator

  return Boolean(areaCodes.length > 0); // we must have some areas
};
