import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const spineChartIsRequired = (searchState: SearchStateParams) => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(areasSelected, groupAreaSelected).filter(
    (code) => code !== areaCodeForEngland
  );

  return areaCodes.length <= 2 && groupAreaSelected !== ALL_AREAS_SELECTED;
};
