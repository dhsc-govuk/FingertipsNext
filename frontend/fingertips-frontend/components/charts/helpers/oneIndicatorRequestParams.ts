import {
  Area,
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorRequest,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';

export const oneIndicatorRequestParams = (
  searchState: SearchStateParams,
  availableAreas: Area[]
): GetHealthDataForAnIndicatorRequest => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorIds,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = searchState;

  const indicatorId = indicatorIds?.at(0) ?? '';
  const areaCodes = [
    ...determineAreaCodes(areasSelected, selectedGroupArea, availableAreas),
  ];

  const areaCodesToRequest = [...areaCodes];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  const areaTypeToUse =
    areaCodes[0] === areaCodeForEngland
      ? englandAreaType.key
      : areaTypeSelected;

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);
  const ancestorCode =
    benchmarkRefType === BenchmarkReferenceType.SubNational
      ? selectedGroupCode
      : undefined;

  return {
    indicatorId: Number(indicatorId),
    areaCodes: areaCodesToRequest,
    areaType: areaTypeToUse,
    benchmarkRefType,
    ancestorCode,
  };
};
