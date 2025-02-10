import { getMapGroupBoundary } from './getMapGroupBoundary';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import { getMapJoinKey } from './getMapJoinKey';
import { mockMapGroupBoundaries } from '@/mock/data/mapGroupBoundaries';

describe('getMapGroupBoundary', () => {
  it.each([
    [
      regionsMap,
      ['E12000008', 'E12000009'],
      getMapJoinKey('Regions Statistical'),
      mockMapGroupBoundaries['Regions Statistical'],
    ],
    [
      countiesAndUAsMap,
      [
        'E08000025',
        'E08000029',
        'E08000030',
        'E08000027',
        'E08000028',
        'E08000031',
        'E08000026',
      ],
      getMapJoinKey('Counties & UAs'),
      mockMapGroupBoundaries['Counties & UAs'],
    ],
  ])(
    'should return the expected GEOjson for the group boundary',
    (mockMap, mockAreaCodes, mockJoinKey, expected) => {
      const actual = getMapGroupBoundary(mockMap, mockAreaCodes, mockJoinKey);

      expect(actual).toEqual(expected);
    }
  );
});
