import {
  mockAreaDataForCountry,
  mockAreaDataForNHSRegion,
} from '@/mock/data/areaData';
import { determineSelectedGroupType } from './determineSelectedGroupType';

const mockParentAreaData = mockAreaDataForCountry['E92000001'];

const mockAreaData = Object.values(mockAreaDataForNHSRegion).map((areaData) => {
  return {
    ...areaData,
    parent: {
      ...mockParentAreaData,
    },
  };
});

describe('DetermineSelectedGroupType', () => {
  it('should return undefined if no selectedGroupType or selectedAreaData is provided', () => {
    const selectedGroupType = determineSelectedGroupType();

    expect(selectedGroupType).toBeUndefined();
  });

  it('should always return the selectedGroupType if provided', () => {
    const selectedGroupType = determineSelectedGroupType(
      'nhs-integrated-care-boards',
      mockAreaData
    );

    expect(selectedGroupType).toEqual('nhs-integrated-care-boards');
  });

  it('should return the areaType of the parent for the first selectedAreaData when no selectedAreaType is provided', () => {
    const selectedGroupType = determineSelectedGroupType(
      undefined,
      mockAreaData
    );

    expect(selectedGroupType).toEqual(mockParentAreaData.areaType.key);
  });
});
