import {
  Area,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  GetHealthDataForAnIndicatorRequest,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import {
  adminIndicatorIdForPopulation,
  areaCodeForEngland,
  nhsIndicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import {
  allAreaTypes,
  HierarchyNameTypes,
} from '@/lib/areaFilterHelpers/areaType';

export const populationPyramidRequestParams = (
  searchState: SearchStateParams,
  availableAreas: Area[]
): GetHealthDataForAnIndicatorRequest => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(
    areasSelected,
    groupAreaSelected,
    availableAreas
  );

  const areaCodesToRequest = [...areaCodes];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  const hierarchyName = allAreaTypes.find(
    (areaType) => areaType.key === areaTypeSelected
  );

  const populationIndicatorID =
    hierarchyName?.hierarchyName === HierarchyNameTypes.NHS
      ? nhsIndicatorIdForPopulation
      : adminIndicatorIdForPopulation;

  return {
    indicatorId: populationIndicatorID,
    areaCodes: areaCodesToRequest,
    inequalities: [
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Age,
    ],
  };
};
