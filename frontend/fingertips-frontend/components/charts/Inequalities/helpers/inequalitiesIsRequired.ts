import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

export const inequalitiesIsRequired = (searchState: SearchStateParams) => {
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds = [],
    [SearchParams.AreasSelected]: selectedAreas = [],
  } = searchState;

  if (indicatorIds.length === 0) return false;

  return selectedAreas.length <= 1;
};
