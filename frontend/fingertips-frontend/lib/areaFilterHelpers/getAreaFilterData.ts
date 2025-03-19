import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '../apiClient/apiClientFactory';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '../searchStateManager';
import { AreaTypeKeys } from './areaType';
import { areaTypeSorter } from '@/lib/areaFilterHelpers/areaTypeSorter';
import { determineApplicableGroupTypes } from './determineApplicableGroupTypes';
import { determineSelectedAreaType } from './determineSelectedAreaType';
import { determineSelectedGroup } from './determineSelectedGroup';
import { determineSelectedGroupType } from './determineSelectedGroupType';
import { determineAvailableAreas } from './determineAvailableAreas';

type AreaFilterData = {
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
  updatedSearchState?: SearchStateParams;
};

export const getAreaFilterData = async (
  searchState: SearchStateParams,
  selectedAreasData?: AreaWithRelations[]
): Promise<AreaFilterData> => {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.GroupSelected]: selectedGroup,
  } = searchState;

  const areasApi = ApiClientFactory.getAreasApiClient();

  const availableAreaTypes = await areasApi.getAreaTypes({}, API_CACHE_CONFIG);
  const sortedByHierarchyAndLevelAreaTypes = areaTypeSorter(availableAreaTypes);

  const determinedSelectedAreaType = determineSelectedAreaType(
    selectedAreaType as AreaTypeKeys,
    selectedAreasData
  );
  stateManager.addParamValueToState(
    SearchParams.AreaTypeSelected,
    determinedSelectedAreaType
  );

  const availableGroupTypes = determineApplicableGroupTypes(
    availableAreaTypes,
    determinedSelectedAreaType
  );

  const sortedByLevelGroupTypes = availableGroupTypes?.toSorted(
    (a, b) => a.level - b.level
  );

  const determinedSelectedGroupType = determineSelectedGroupType(
    selectedGroupType as AreaTypeKeys,
    sortedByLevelGroupTypes
  );
  stateManager.addParamValueToState(
    SearchParams.GroupTypeSelected,
    determinedSelectedGroupType
  );

  const availableGroups = await areasApi.getAreaTypeMembers(
    {
      areaTypeKey: determinedSelectedGroupType,
    },
    API_CACHE_CONFIG
  );

  const determinedSelectedGroup = determineSelectedGroup(
    selectedGroup,
    availableGroups
  );
  stateManager.addParamValueToState(
    SearchParams.GroupSelected,
    determinedSelectedGroup
  );

  const availableArea: AreaWithRelations = await areasApi.getArea(
    {
      areaCode: determinedSelectedGroup,
      includeChildren: true,
      childAreaType: determinedSelectedAreaType,
    },
    API_CACHE_CONFIG
  );
  const availableAreas = determineAvailableAreas(
    determinedSelectedAreaType,
    availableArea
  );

  const sortedAlphabeticallyAvailableAreas = availableAreas?.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  return {
    availableAreaTypes: sortedByHierarchyAndLevelAreaTypes,
    availableGroupTypes: sortedByLevelGroupTypes,
    availableGroups,
    availableAreas: sortedAlphabeticallyAvailableAreas,
    updatedSearchState: stateManager.getSearchState(),
  };
};
