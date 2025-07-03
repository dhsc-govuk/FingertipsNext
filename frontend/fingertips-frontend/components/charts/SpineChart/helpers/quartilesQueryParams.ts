import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorsQuartilesGetRequest } from '@/generated-sources/ft-api-client';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

export const quartilesQueryParams = (
  searchState: SearchStateParams
): IndicatorsQuartilesGetRequest => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected = [],
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);
  const areaCodes = determineAreaCodes(areasSelected, groupAreaSelected);

  return {
    indicatorIds: indicatorsSelected.map(Number),
    areaCode: areaCodes[0],
    ancestorCode: selectedGroupCode ?? areaCodeForEngland,
    areaType: selectedAreaType,
    benchmarkRefType,
  };
};
