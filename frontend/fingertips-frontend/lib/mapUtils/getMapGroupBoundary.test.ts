import { getMapGroupBoundary } from './getMapGroupBoundary';

const mockMap = {
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
        name: 'Polygon 1',
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
              [2, 2],
              [1, 2],
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
        name: 'Polygon 2 and 3',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1, 0],
            [3, 0],
            [3, 1],
            [1, 1],
            [1, 0],
          ],
        ],
      },
      properties: {
        name: 'Polygon 4',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [3, 0],
              [4, 0],
              [4, 1],
              [3, 1],
              [3, 0],
            ],
          ],
          [
            [
              [4, 1],
              [5, 1],
              [5, 2],
              [4, 2],
              [4, 1],
            ],
          ],
        ],
      },
      properties: {
        name: 'Discontinuous Polygons',
      },
    },
  ],
};

describe('getMapGroupBoundary', () => {
  it('should return a GEOjson with a single feature when passed a single area code for an area with a single polygon', () => {
    const mapData = mockMap;
    const areaCodes = ['Polygon 1'];
    const joinKey = 'name';

    const expected = {
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
        },
      ],
    };
    const actual = getMapGroupBoundary(mapData, areaCodes, joinKey);

    expect(actual).toEqual(expected);
  });
  it('should return a GEOjson with a single feature when passed a two area codes for an areas that each have a single polygon', () => {
    const mapData = mockMap;
    const areaCodes = ['Polygon 1', 'Polygon 4'];
    const joinKey = 'name';

    const expected = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  [0, 0],
                  [3, 0],
                  [3, 1],
                  [0, 1],
                  [0, 0],
                ],
              ],
              ,
            ],
          },
        },
      ],
    };
    const actual = getMapGroupBoundary(mapData, areaCodes, joinKey);

    expect(actual).toEqual(expected);
  });
});
