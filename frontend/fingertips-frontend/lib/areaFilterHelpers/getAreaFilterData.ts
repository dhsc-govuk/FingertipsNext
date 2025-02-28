import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '../apiClient/apiClientFactory';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '../searchStateManager';
import { AreaTypeKeys } from './areaType';
import { determineApplicableGroupTypes } from './determineApplicableGroupTypes';
import { determineSelectedAreaType } from './determineSelectedAreaType';
import { determineSelectedGroup } from './determineSelectedGroup';
import { determineSelectedGroupType } from './determineSelectedGroupType';

type AreaFilterData = {
  availableAreaTypes?: AreaType[];
  selectedAreasData?: AreaWithRelations[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
  updatedSearchState?: SearchStateParams;
};

export const getAreaFilterData = async (
  searchState: SearchStateParams
): Promise<AreaFilterData> => {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.GroupSelected]: selectedGroup,
  } = searchState;

  const areasApi = ApiClientFactory.getAreasApiClient();

  const availableAreaTypes = await areasApi.getAreaTypes();
  const sortedByLevelAreaTypes = availableAreaTypes?.toSorted(
    (a, b) => a.level - b.level
  );

  const selectedAreasData =
    areasSelected && areasSelected.length > 0
      ? await Promise.all(
          areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
        )
      : [];

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

  const determinedSelectedGroupType = determineSelectedGroupType(
    selectedGroupType as AreaTypeKeys
  );
  stateManager.addParamValueToState(
    SearchParams.GroupTypeSelected,
    determinedSelectedGroupType
  );

  const availableGroups = await areasApi.getAreaTypeMembers({
    areaTypeKey: determinedSelectedGroupType,
  });

  const determinedSelectedGroup = determineSelectedGroup(
    selectedGroup,
    availableGroups
  );
  stateManager.addParamValueToState(
    SearchParams.GroupSelected,
    determinedSelectedGroup
  );

  const availableArea: AreaWithRelations = await areasApi.getArea({
    areaCode: determinedSelectedGroup,
    includeChildren: true,
    childAreaType: determinedSelectedAreaType,
  });
  const availableAreas = availableArea ? availableArea.children : [];

  return {
    availableAreaTypes: sortedByLevelAreaTypes,
    selectedAreasData,
    availableGroupTypes,
    availableGroups,
    availableAreas,
    updatedSearchState: stateManager.getSearchState(),
  };
};
