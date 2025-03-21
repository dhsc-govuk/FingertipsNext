import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import combinedAuthoritiesMap from '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';
import { GeoJSON } from 'highcharts';
import { AreaTypeKeysForMapMeta, getMapData } from './thematicMapHelpers';
import {
  AreaTypeKeysGroupBoundaries,
  mockMapGroupBoundaries,
} from '@/mock/data/mapGroupBoundaries';

describe('getMapData', () => {
  it.each<[AreaTypeKeysForMapMeta, string[], string]>([
    ['regions', ['E12000008', 'E12000009'], 'RGN23CD'],
    [
      'counties-and-unitary-authorities',
      ['E08000025', 'E08000029'],
      'CTYUA23CD',
    ],
    [
      'districts-and-unitary-authorities',
      ['E07000136', 'E07000137'],
      'LAD24CD',
    ],
    ['combined-authorities', ['E47000002', 'E47000003'], 'CAUTH23CD'],
    ['nhs-regions', ['E40000011', 'E40000012'], 'NHSER24CD'],
    ['nhs-integrated-care-boards', ['E54000010', 'E54000011'], 'ICB23CD'],
    ['nhs-sub-integrated-care-boards', ['E38000236', 'E38000062'], 'SICBL23CD'],
  ])(
    'should return an object with the expected mapJoinKey for the given areaType',
    (areaType, areaCodes, expectedMapJoinKey) => {
      const actual = getMapData(areaType, areaCodes);
      expect(actual.mapJoinKey).toEqual(expectedMapJoinKey);
    }
  );

  it.each<[AreaTypeKeysForMapMeta, string[], GeoJSON]>([
    ['regions', ['E12000008', 'E12000009'], regionsMap],
    [
      'counties-and-unitary-authorities',
      ['E08000025', 'E08000029'],
      countiesAndUAsMap,
    ],
    [
      'districts-and-unitary-authorities',
      ['E07000136', 'E07000137'],
      districtsAndUAsMap,
    ],
    [
      'combined-authorities',
      ['E47000002', 'E47000003'],
      combinedAuthoritiesMap,
    ],
    ['nhs-regions', ['E40000011', 'E40000012'], NHSRegionsMap],
    ['nhs-integrated-care-boards', ['E54000010', 'E54000011'], NHSICBMap],
    [
      'nhs-sub-integrated-care-boards',
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

  it.each<[AreaTypeKeysGroupBoundaries, string[]]>([
    ['regions', ['E12000008', 'E12000009']],
    [
      'counties-and-unitary-authorities',
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

describe('prepareThematicMapSeriesData', () => {
  it.todo('should return the expected series data, including colour');
  it.todo('should return the most recent year');
});
