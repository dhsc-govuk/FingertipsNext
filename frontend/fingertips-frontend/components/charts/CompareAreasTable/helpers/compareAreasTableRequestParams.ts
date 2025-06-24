import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  Area,
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorRequest,
} from '@/generated-sources/ft-api-client';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const compareAreasTableRequestParams = (
  searchState: SearchStateParams,
  availableAreas: Area[]
): GetHealthDataForAnIndicatorRequest => {
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = searchState;

  const indicatorId = indicatorIds?.at(0) ?? '';
  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);
  const ancestorCode =
    benchmarkRefType === BenchmarkReferenceType.SubNational
      ? selectedGroupCode
      : undefined;

  const areaCodes = [
    ...determineAreaCodes(areasSelected, selectedGroupArea, availableAreas),
  ];

  if (!areaCodes.includes(areaCodeForEngland)) {
    areaCodes.push(areaCodeForEngland);
  }
  if (selectedGroupCode && !areaCodes.includes(selectedGroupCode)) {
    areaCodes.push(selectedGroupCode);
  }

  return {
    indicatorId: Number(indicatorId),
    areaType: selectedAreaType,
    benchmarkRefType,
    ancestorCode,
    areaCodes,
  };
};
