import { GeoJSONFeature } from 'highcharts';
import { getMapFile } from './getMapFile';
import { getMapJoinKey } from './getMapJoinKey';
import { getMapGroup } from './getMapGroup';

describe.skip('getMapZoom', () => {
  it('should return an array of co-ordinates which define the limits of a single region, when passed a map geojson, a single region code and joinKey', () => {
    // TODO: make a sensible mock geoJson that can be tested
    const areaType = 'Regions Statistical';
    const expected: GeoJSONFeature = {
      type: 'MultiPolygon',
      coordinates: [
        [-1, 45],
        [-1, 45],
        [3, 59],
        [3, 59],
      ],
    };

    const actual = getMapGroup(
      getMapFile(areaType),
      ['E12000001', 'E12000002'],
      getMapJoinKey(areaType)
    );

    expect(actual).toEqual(expected);
  });
});
