import { mockAreaDataForNHSRegion, mockAreaTypes } from '@/mock/data/areaData';
import { determineSelectedAreaType } from './determineSelectedAreaType';

describe('determineSelectedAreaType', () => {
  const mockSelectedAreaData = Object.values(mockAreaDataForNHSRegion);

  it('should return undefined if no parameters are provided', () => {
    const selectedAreaType = determineSelectedAreaType();

    expect(selectedAreaType).toBeUndefined();
  });

  it('should always return the selectedAreaType if provided', () => {
    const selectedAreaType = determineSelectedAreaType(
      'NHS region',
      mockSelectedAreaData,
      mockAreaTypes
    );

    expect(selectedAreaType).toEqual('NHS region');
  });

  it('should return the areaType of the first selectedAreaData when no selectedAreaType is provided', () => {
    const selectedAreaType = determineSelectedAreaType(
      undefined,
      mockSelectedAreaData,
      mockAreaTypes
    );

    expect(selectedAreaType).toEqual(mockSelectedAreaData[0].areaType);
  });

  it('should return the areaType of the first available areaType if no selectedAreaType or selectedAreaData in provided', () => {
    const selectedAreaType = determineSelectedAreaType(
      undefined,
      undefined,
      mockAreaTypes
    );

    expect(selectedAreaType).toEqual(mockAreaTypes[0].name);
  });
});
