import { getMapData } from './getMapData';

describe('getMapData', () => {
  it.each([
    ['Regions Statistical', 'RGN23CD'],
    ['Counties & UAs', 'CTYUA23CD'],
    ['Districts & UAs', 'LAD24CD'],
    ['Combined Authorities', 'CAUTH23CD'],
    ['NHS region', 'NHSER24CD'],
    ['ICB', 'ICB23CD'],
    ['Sub ICB', 'SICBL23CD'],
  ])(
    'should return an object with the correct mapJoinKey object for the given areaType',
    (areaType, expectedMapJoinKey) => {
      const actual = getMapData(areaType);
      expect(actual.mapJoinKey).toEqual(expectedMapJoinKey);
    }
  );
});
