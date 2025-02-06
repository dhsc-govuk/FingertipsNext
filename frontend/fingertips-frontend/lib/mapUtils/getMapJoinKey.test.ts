import { getMapJoinKey } from './getMapJoinKey';

describe('getMapFiles', () => {
  it.each([
    ['Regions Statistical', 'RGN23CD'],
    ['Counties & UAs', 'CTYUA23CD'],
    ['Districts & UAs', 'LAD24CD'],
    ['Combined Authorities', 'CAUTH23CD'],
    ['NHS region', 'NHSER24CD'],
    ['ICB', 'ICB23CD'],
    ['Sub ICB', 'SICBL23CD'],
  ])(
    'should return the correct map file for the given areaType',
    (areaType, expectedMapJoinKey) => {
      const actual = getMapJoinKey(areaType);
      expect(actual).toEqual(expectedMapJoinKey);
    }
  );
});
