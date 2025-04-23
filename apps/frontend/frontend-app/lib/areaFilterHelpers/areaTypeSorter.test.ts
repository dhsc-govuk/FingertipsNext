import { AreaType } from '@/generated-sources/ft-api-client';
import { areaTypeSorter } from './areaTypeSorter';
import {
  allAreaTypes,
  adminHierarchyAreaTypes,
  nhsHierarchyAreaTypes,
  englandAreaType,
  regionsAreaType,
  nhsSubIntegratedCareBoardsAreaType,
  nhsIntegratedCareBoardsAreaType,
  gpsAreaType,
  districtAndUnitaryAuthoritiesAreaType,
  countiesAndUnitaryAuthoritiesAreaType,
} from '@/lib/areaFilterHelpers/areaType';

describe('areaTypeSorter', () => {
  it('should return area types sorted by hierarchy and level', () => {
    const expectedSortedAreaTypes: AreaType[] = [
      englandAreaType,
      ...adminHierarchyAreaTypes.toSorted((a, b) => a.level - b.level),
      ...nhsHierarchyAreaTypes.toSorted((a, b) => a.level - b.level),
    ];

    const sortedAreaTypes = areaTypeSorter(allAreaTypes);

    expect(sortedAreaTypes).toEqual(expectedSortedAreaTypes);
  });

  it('should return correct order when Administrative AreaType data is missing', () => {
    const mockAreaTypesWithoutAdmin: AreaType[] = [
      englandAreaType,
      ...nhsHierarchyAreaTypes,
    ];

    const expectedSortedWithoutAdmin: AreaType[] = [
      englandAreaType,
      ...nhsHierarchyAreaTypes.toSorted((a, b) => a.level - b.level),
    ];

    const sortedAreaTypes = areaTypeSorter(mockAreaTypesWithoutAdmin);

    expect(sortedAreaTypes).toEqual(expectedSortedWithoutAdmin);
  });

  it('should return correct order when only a subset of AreaType data is given', () => {
    const mockAreaTypes: AreaType[] = [
      districtAndUnitaryAuthoritiesAreaType,
      englandAreaType,
      nhsSubIntegratedCareBoardsAreaType,
      regionsAreaType,
      nhsIntegratedCareBoardsAreaType,
      gpsAreaType,
      countiesAndUnitaryAuthoritiesAreaType,
    ];

    const mocksortedAreaTypes: AreaType[] = [
      englandAreaType,
      regionsAreaType,
      countiesAndUnitaryAuthoritiesAreaType,
      districtAndUnitaryAuthoritiesAreaType,
      nhsIntegratedCareBoardsAreaType,
      nhsSubIntegratedCareBoardsAreaType,
      gpsAreaType,
    ];

    const sortedAreaTypes = areaTypeSorter(mockAreaTypes);

    expect(sortedAreaTypes).toEqual(mocksortedAreaTypes);
  });
});
