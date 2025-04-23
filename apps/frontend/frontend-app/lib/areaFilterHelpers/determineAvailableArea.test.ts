import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { AreaTypeKeys, englandAreaType, nhsRegionsAreaType } from './areaType';
import { determineAvailableAreas } from './determineAvailableAreas';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { englandArea } from '@/mock/data/areas/englandAreas';

const mockAvailableArea = mockAreaDataForNHSRegion[eastEnglandNHSRegion.code];

describe('determineAvailableAreas', () => {
  it('should return an array containing the england area if the selectedAreaType is england', () => {
    const availableAreas = determineAvailableAreas(
      englandAreaType.key as AreaTypeKeys
    );

    expect(availableAreas).toEqual([englandArea]);
  });

  it('should return all the children of the availableArea when the selectedAreaType is not england', () => {
    const availableAreas = determineAvailableAreas(
      nhsRegionsAreaType.key as AreaTypeKeys,
      mockAvailableArea
    );

    expect(availableAreas).toEqual(mockAvailableArea.children);
  });

  it('should return an empty array when the selectedAreaType is not england and the availableArea has no children', () => {
    const mockAvailableAreaWithNoChildren = {
      ...mockAvailableArea,
      children: undefined,
    };

    const availableAreas = determineAvailableAreas(
      nhsRegionsAreaType.key as AreaTypeKeys,
      mockAvailableAreaWithNoChildren
    );

    expect(availableAreas).toEqual([]);
  });
});
