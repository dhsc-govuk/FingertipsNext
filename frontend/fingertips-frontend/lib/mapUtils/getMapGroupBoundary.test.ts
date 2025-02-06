import { GeoJSON } from 'highcharts';

const mockMapData: GeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
      properties: {
        name: 'Rectangle 1',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [1, 0],
              [2, 0],
              [2, 1],
              [1, 1],
              [1, 0],
            ],
          ],
          [
            [
              [2, 1],
              [3, 1],
              [3, 2],
              [2, 2],
              [2, 1],
            ],
          ],
        ],
      },
      properties: {
        name: 'Rectangle 2 and 4',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2, 0],
            [3, 0],
            [3, 1],
            [2, 1],
            [2, 0],
          ],
        ],
      },
      properties: {
        name: 'Rectangle 3',
      },
    },
  ],
};

const mockJoinKey = 'name';
describe('getMapGroupBoundary', () => {
  it('should return a single area when passed a single item in areaCodes[]', () => {});
});
