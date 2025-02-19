import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { determineSelectedAreaType } from './determineSelectedAreaType';

describe('determineSelectedAreaType', () => {
  const mockSelectedAreaData = Object.values(mockAreaDataForNHSRegion);

  it('should return england if no parameters are provided', () => {
    const selectedAreaType = determineSelectedAreaType();

    expect(selectedAreaType).toEqual('england');
  });

  it('should always return the selectedAreaType if provided', () => {
    const selectedAreaType = determineSelectedAreaType(
      'nhs-regions',
      mockSelectedAreaData
    );

    expect(selectedAreaType).toEqual('nhs-regions');
  });

  it('should return the areaType key of the first selectedAreaData when no selectedAreaType is provided', () => {
    const selectedAreaType = determineSelectedAreaType(
      undefined,
      mockSelectedAreaData
    );

    expect(selectedAreaType).toEqual(mockSelectedAreaData[0].areaType.key);
  });
});
