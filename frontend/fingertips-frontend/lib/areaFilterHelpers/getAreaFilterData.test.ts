import { AreasApi, AreaType } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockDeep } from 'jest-mock-extended';
import { getAreaFilterData } from './getAreaFilterData';
import {
  allAreaTypes,
  AreaTypeKeys,
  englandAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsRegionsAreaType,
} from './areaType';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { SearchParams } from '../searchStateManager';
import {
  mockAreaDataForNHSRegion,
  mockAvailableAreas,
} from '@/mock/data/areaData';

const mockAreasApi = mockDeep<AreasApi>();
ApiClientFactory.getAreasApiClient = () => mockAreasApi;

describe('getAreaFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return availableAreaTypes with a sorted by level list of areaTypes from the getAreaTypes call', async () => {
    mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

    const mockSortedAreaTypes: AreaType[] = allAreaTypes.toSorted(
      (a, b) => a.level - b.level
    );

    const { availableAreaTypes } = await getAreaFilterData({});

    expect(mockAreasApi.getAreaTypes).toHaveBeenCalled();
    expect(availableAreaTypes).toEqual(mockSortedAreaTypes);
  });

  it('should return availableGroupTypes prop with a subset of areaTypes that are applicable based upon the areaTypeSelected', async () => {
    mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

    const { availableGroupTypes } = await getAreaFilterData({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
    });

    expect(availableGroupTypes).toEqual([nhsRegionsAreaType, englandAreaType]);
  });

  it('should return availableGroups with results from getAreaTypeMembers based upon selected groupType', async () => {
    const allAreasForICBAreaType =
      mockAvailableAreas[nhsIntegratedCareBoardsAreaType.key as AreaTypeKeys];

    mockAreasApi.getAreaTypeMembers.mockResolvedValue(allAreasForICBAreaType);

    const { availableGroups } = await getAreaFilterData({
      [SearchParams.GroupTypeSelected]: nhsRegionsAreaType.key,
    });

    expect(mockAreasApi.getAreaTypeMembers).toHaveBeenCalledWith({
      areaTypeKey: nhsRegionsAreaType.key,
    });
    expect(availableGroups).toEqual(allAreasForICBAreaType);
  });

  it('should return availableAreas with the children from the getArea call based upon the group selected', async () => {
    mockAreasApi.getArea.mockResolvedValueOnce(
      mockAreaDataForNHSRegion[eastEnglandNHSRegion.code]
    );

    const { availableAreas } = await getAreaFilterData({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
      [SearchParams.GroupTypeSelected]: nhsRegionsAreaType.key,
      [SearchParams.GroupSelected]: eastEnglandNHSRegion.code,
    });

    expect(mockAreasApi.getArea).toHaveBeenCalledWith({
      areaCode: eastEnglandNHSRegion.code,
      includeChildren: true,
      childAreaType: nhsIntegratedCareBoardsAreaType.key,
    });
    expect(availableAreas).toEqual(
      mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children
    );
  });

  it('should return updatedSearchState with data from selected state or calculated', async () => {
    const allAreasForICBAreaType =
      mockAvailableAreas[nhsIntegratedCareBoardsAreaType.key as AreaTypeKeys];
    mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);
    mockAreasApi.getAreaTypeMembers.mockResolvedValue(allAreasForICBAreaType);

    const { updatedSearchState } = await getAreaFilterData({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
    });

    expect(updatedSearchState).toEqual({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
      [SearchParams.GroupTypeSelected]: englandAreaType.key,
      [SearchParams.GroupSelected]: allAreasForICBAreaType[0].code,
    });
  });
});
