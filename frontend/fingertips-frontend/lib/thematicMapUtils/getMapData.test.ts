import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import combinedAuthoritiesMap from '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';

import { getMapData } from './getMapData';
import { mockMapGroupBoundaries } from '@/mock/data/mapGroupBoundaries';

describe('getMapData', () => {
  it.each([
    ['Regions', ['E12000008', 'E12000009'], 'RGN23CD'],
    [
      'Counties and Unitary Authorities',
      ['E08000025', 'E08000029'],
      'CTYUA23CD',
    ],
    [
      'Districts and Unitary Authorities',
      ['E07000136', 'E07000137'],
      'LAD24CD',
    ],
    ['Combined Authorities', ['E47000002', 'E47000003'], 'CAUTH23CD'],
    ['NHS Regions', ['E40000011', 'E40000012'], 'NHSER24CD'],
    ['NHS Integrated Care Boards', ['E54000010', 'E54000011'], 'ICB23CD'],
    ['NHS Sub Integrated Care Boards', ['E38000236', 'E38000062'], 'SICBL23CD'],
  ])(
    'should return an object with the expected mapJoinKey for the given areaType',
    (areaType, areaCodes, expectedMapJoinKey) => {
      const actual = getMapData(areaType, areaCodes);
      expect(actual.mapJoinKey).toEqual(expectedMapJoinKey);
    }
  );

  it.each([
    ['Regions', ['E12000008', 'E12000009'], regionsMap],
    [
      'Counties and Unitary Authorities',
      ['E08000025', 'E08000029'],
      countiesAndUAsMap,
    ],
    [
      'Districts and Unitary Authorities',
      ['E07000136', 'E07000137'],
      districtsAndUAsMap,
    ],
    [
      'Combined Authorities',
      ['E47000002', 'E47000003'],
      combinedAuthoritiesMap,
    ],
    ['NHS Regions', ['E40000011', 'E40000012'], NHSRegionsMap],
    ['NHS Integrated Care Boards', ['E54000010', 'E54000011'], NHSICBMap],
    [
      'NHS Sub Integrated Care Boards',
      ['E38000236', 'E38000062'],
      NHSSubICBMap,
    ],
  ])(
    'should return an object with the correct mapFile for the given areaType',
    (areaType, areaCodes, expectedMapData) => {
      const actual = getMapData(areaType, areaCodes);
      expect(actual.mapFile).toEqual(expectedMapData);
    }
  );

  it.each([
    ['Regions', ['E12000008', 'E12000009']],
    [
      'Counties and Unitary Authorities',
      [
        'E08000025',
        'E08000029',
        'E08000030',
        'E08000027',
        'E08000028',
        'E08000031',
        'E08000026',
      ],
    ],
  ])(
    'should return an object with the expected mapGroupBoundary',
    (areaType, areaCodes) => {
      const actual = getMapData(areaType, areaCodes);
      expect(actual.mapGroupBoundary).toEqual(mockMapGroupBoundaries[areaType]);
    }
  );
});
