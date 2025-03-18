import { AreasApi, AreaType } from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockDeep } from 'jest-mock-extended';
import { getAreaFilterData } from './getAreaFilterData';
import {
  allAreaTypes,
  AreaTypeKeys,
  englandAreaType,
  regionsAreaType,
  nhsSubIntegratedCareBoardsAreaType,
  nhsPrimaryCareNetworksAreaType,
  nhsIntegratedCareBoardsAreaType,
  gpsAreaType,
  nhsRegionsAreaType,
  districtAndUnitaryAuthoritiesAreaType,
  combinedAuthoritiesAreaType,
  countiesAndUnitaryAuthoritiesAreaType,
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

  it('should call sortAreaTypesByHierarchyAndLevel and return the correctly sorted area types', async () => {
    mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

    const mockSortedAreaTypes: AreaType[] = [
      englandAreaType,
      combinedAuthoritiesAreaType,
      regionsAreaType,
      countiesAndUnitaryAuthoritiesAreaType,
      districtAndUnitaryAuthoritiesAreaType,
      nhsRegionsAreaType,
      nhsIntegratedCareBoardsAreaType,
      nhsSubIntegratedCareBoardsAreaType,
      nhsPrimaryCareNetworksAreaType,
      gpsAreaType,
    ];

    const { availableAreaTypes } = await getAreaFilterData({});

    expect(mockAreasApi.getAreaTypes).toHaveBeenCalledWith(
      {},
      API_CACHE_CONFIG
    );

    expect(availableAreaTypes).toEqual(mockSortedAreaTypes);
  });

  it('should return availableGroupTypes prop with a subset of areaTypes sorted by level that are applicable based upon the areaTypeSelected', async () => {
    mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

    const { availableGroupTypes } = await getAreaFilterData({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
    });

    expect(availableGroupTypes).toEqual([englandAreaType, nhsRegionsAreaType]);
  });

  it('should return availableGroups with results from getAreaTypeMembers based upon selected groupType', async () => {
    const allAreasForICBAreaType =
      mockAvailableAreas[nhsIntegratedCareBoardsAreaType.key as AreaTypeKeys];

    mockAreasApi.getAreaTypeMembers.mockResolvedValue(allAreasForICBAreaType);

    const { availableGroups } = await getAreaFilterData({
      [SearchParams.GroupTypeSelected]: nhsRegionsAreaType.key,
    });

    expect(mockAreasApi.getAreaTypeMembers).toHaveBeenCalledWith(
      {
        areaTypeKey: nhsRegionsAreaType.key,
      },
      API_CACHE_CONFIG
    );
    expect(availableGroups).toEqual(allAreasForICBAreaType);
  });

  it('should return availableAreas with the children sorted alphabetically from the getArea call based upon the group selected', async () => {
    const areasSortedAlphabetically = mockAreaDataForNHSRegion[
      eastEnglandNHSRegion.code
    ].children?.toSorted((a, b) => a.name.localeCompare(b.name));

    mockAreasApi.getArea.mockResolvedValueOnce(
      mockAreaDataForNHSRegion[eastEnglandNHSRegion.code]
    );

    const { availableAreas } = await getAreaFilterData({
      [SearchParams.AreaTypeSelected]: nhsIntegratedCareBoardsAreaType.key,
      [SearchParams.GroupTypeSelected]: nhsRegionsAreaType.key,
      [SearchParams.GroupSelected]: eastEnglandNHSRegion.code,
    });

    expect(mockAreasApi.getArea).toHaveBeenCalledWith(
      {
        areaCode: eastEnglandNHSRegion.code,
        includeChildren: true,
        childAreaType: nhsIntegratedCareBoardsAreaType.key,
      },
      API_CACHE_CONFIG
    );
    expect(availableAreas).toEqual(areasSortedAlphabetically);
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
