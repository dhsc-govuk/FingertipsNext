import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import combinedAuthoritiesMap from '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';
import { GeoJSON } from 'highcharts';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
  getMapGeographyData,
  MapGeographyData,
  prepareThematicMapSeriesData,
} from './thematicMapHelpers';
import {
  AreaTypeKeysGroupBoundaries,
  mockMapGroupBoundaries,
} from '@/mock/data/mapGroupBoundaries';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { mockHealthData } from '@/mock/data/healthdata';

const mockMapData: MapGeographyData = {
  mapFile: regionsMap,
  mapGroupBoundary: mockMapGroupBoundaries.regions,
};
describe('getMapGeographyData', () => {
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
      const actual = getMapGeographyData(areaType, areaCodes);
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
      const actual = getMapGeographyData(areaType, areaCodes);
      expect(actual.mapGroupBoundary).toEqual(mockMapGroupBoundaries[areaType]);
    }
  );
});

describe('prepareThematicMapSeriesData', () => {
  const mockHealthData: HealthDataForArea[] = [
    {
      areaCode: 'E92000001',
      areaName: 'England',
      healthData: [
        {
          year: 2004,
          value: 978.34,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Better' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
        {
          year: 2008,
          value: 800.232,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Higher' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
      ],
    },
    {
      areaCode: 'E12000001',
      areaName: 'North East region (statistical)',
      healthData: [
        {
          year: 2004,
          value: 856.344,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Lower' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
        {
          year: 2008,
          value: 767.343,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'NotCompared' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
      ],
    },
    {
      areaCode: 'E12000003',
      areaName: 'Yorkshire and the Humber region (statistical)',
      healthData: [
        {
          year: 2004,
          value: 674.434,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Similar' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
        {
          year: 2008,
          value: 643.434,
          ageBand: 'All',
          sex: 'Persons',
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Worse' },
          deprivation: { sequence: 1, type: 'All', value: 'All' },
        },
      ],
    },
  ];

  const expected = [
    {
      areaCode: 'E92000001',
      areaName: 'England',
      benchmarkComparisonOutcome: 'Higher',
      benchmarkColourCode: 55,
      value: 800.232,
    },
    {
      areaCode: 'E12000001',
      areaName: 'North East region (statistical)',
      benchmarkComparisonOutcome: 'NotCompared',
      benchmarkColourCode: 5,
      value: 767.343,
    },
    {
      areaCode: 'E12000003',
      areaName: 'Yorkshire and the Humber region (statistical)',
      benchmarkComparisonOutcome: 'Worse',
      benchmarkColourCode: 35,
      value: 643.434,
    },
  ];
  it('should return the expected series data, for the most recent year', () => {
    const actual = prepareThematicMapSeriesData(mockHealthData);

    expect(actual).toEqual(expected);
  });
});

describe('createThematicMapChartOptions', () => {
  it('should return an object with the correct map', () => {
    const options = createThematicMapChartOptions(
      mockMapData,
      mockHealthData[108],
      'regions',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.NoJudgement
    );

    expect(options).toBeDefined();
    expect(options.series?.[0].mapData).toEqual(mockMapData.mapFile);
  });
  it('should return the correct hover text', () => {
    const options = createThematicMapChartOptions(
      mockMapData,
      mockHealthData[108],
      'regions',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.NoJudgement
    );

    console.log(options?.series?.[2].tooltip);
  });
});
