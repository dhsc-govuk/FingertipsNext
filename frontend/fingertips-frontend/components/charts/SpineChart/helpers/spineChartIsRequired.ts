import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

export const spineChartIsRequired = (searchState: SearchStateParams) => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected = [],
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(areasSelected, groupAreaSelected);

  return (
    areaCodes.length <= 2 &&
    indicatorsSelected.length >= 2 &&
    groupAreaSelected !== ALL_AREAS_SELECTED
  );
};
