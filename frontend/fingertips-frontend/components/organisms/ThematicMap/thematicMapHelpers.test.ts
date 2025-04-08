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
  generateThematicMapTooltipString,
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
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { mockHealthData } from '@/mock/data/healthdata';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

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
    async (areaType, areaCodes, expectedMapData) => {
      const actual = await getMapGeographyData(areaType, areaCodes);
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
    async (areaType, areaCodes) => {
      const actual = await getMapGeographyData(areaType, areaCodes);
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Better' },
          deprivation: noDeprivation,
        },
        {
          year: 2008,
          value: 800.232,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Higher' },
          deprivation: noDeprivation,
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Lower' },
          deprivation: noDeprivation,
        },
        {
          year: 2008,
          value: 767.343,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'NotCompared' },
          deprivation: noDeprivation,
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
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Similar' },
          deprivation: noDeprivation,
        },
        {
          year: 2008,
          value: 643.434,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.CannotBeCalculated,
          benchmarkComparison: { outcome: 'Worse' },
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const expected = [
    {
      areaName: mockHealthData[0].areaName,
      areaCode: mockHealthData[0].areaCode,
      value: mockHealthData[0].healthData[1].value,
      year: mockHealthData[0].healthData[1].year,
      benchmarkComparisonOutcome:
        mockHealthData[0].healthData[1].benchmarkComparison?.outcome,
      benchmarkColourCode: 55,
    },
    {
      areaName: mockHealthData[1].areaName,
      areaCode: mockHealthData[1].areaCode,
      value: mockHealthData[1].healthData[1].value,
      year: mockHealthData[1].healthData[1].year,
      benchmarkComparisonOutcome:
        mockHealthData[1].healthData[1].benchmarkComparison?.outcome,
      benchmarkColourCode: 5,
    },
    {
      areaName: mockHealthData[2].areaName,
      areaCode: mockHealthData[2].areaCode,
      value: mockHealthData[2].healthData[1].value,
      year: mockHealthData[2].healthData[1].year,
      benchmarkComparisonOutcome:
        mockHealthData[2].healthData[1].benchmarkComparison?.outcome,
      benchmarkColourCode: 35,
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
      mockHealthData[108],
      mockMapData,
      'regions',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.NoJudgement
    );

    expect(options).toBeDefined();
    expect(options.series?.[0].mapData).toEqual(mockMapData.mapFile);
  });
});
describe('generateThematicMapTooltipString', () => {
  const mockHcPoint = {
    areaName: 'area',
    year: 2004,
    benchmarkComparisonOutcome: BenchmarkOutcome.Better,
    value: 10,
  };

  const mockGroupDataForYear: HealthDataForArea = {
    ...mockHealthData[108][1],
    healthData: [
      {
        ...mockHealthData[108][1].healthData[0],
        benchmarkComparison: { outcome: 'Worse' },
      },
    ],
  };

  const mockBenchmarkDataForYear: HealthDataForArea = {
    ...mockHealthData[108][0],
    healthData: [
      {
        ...mockHealthData[108][1].healthData[0],
        benchmarkComparison: { outcome: 'Worse' },
      },
    ],
  };

  const expectedAreaTooltip =
    `<br /><span style="font-weight: bold">${mockHcPoint.areaName}</span>` +
    `<br /><span>${mockHcPoint.year}</span>` +
    `<br /><span style="color: ${GovukColours.Green}; font-size: large;">${SymbolsEnum.Circle}</span>` +
    `<span>${formatNumber(mockHcPoint.value)} mock units</span>` +
    `<br /><span>${mockHcPoint.benchmarkComparisonOutcome} than England</span><br /><span>(95%)</span>`;

  const expectedGroupTooltip =
    `<br /><span style=\"font-weight: bold\">Group: ${mockGroupDataForYear.areaName}</span>` +
    `<br /><span>${mockGroupDataForYear.healthData[0].year}</span><br />` +
    `<span style=\"color: ${GovukColours.Red}; font-size: large;\">${SymbolsEnum.Diamond}</span>` +
    `<span>${formatNumber(mockGroupDataForYear.healthData[0].value)} mock units</span>` +
    `<br /><span>${mockGroupDataForYear.healthData[0].benchmarkComparison?.outcome} than England</span><br /><span>(95%)</span>`;

  const expectedBenchmarkTooltip =
    `<span style=\"font-weight: bold\">Benchmark: ${mockBenchmarkDataForYear.areaName}</span>` +
    `<br /><span>${mockBenchmarkDataForYear.healthData[0].year}</span><br />` +
    `<span style=\"color: ${GovukColours.Black}; font-size: large;\">${SymbolsEnum.Circle}</span>` +
    `<span>${formatNumber(mockBenchmarkDataForYear.healthData[0].value)} mock units</span>`;

  it('should return the expected tooltip for an area', () => {
    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      undefined,
      undefined,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(expectedAreaTooltip);
  });
  it('should return the expected tooltip for an area which is "not compared"', () => {
    const mockHcPoint = {
      areaName: 'area',
      year: 1979,
      benchmarkComparisonOutcome: BenchmarkOutcome.NotCompared,
      value: 10,
    };
    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      undefined,
      undefined,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    const expectedAreaToolTip =
      `<br /><span style="font-weight: bold">${mockHcPoint.areaName}</span>` +
      `<br /><span>${mockHcPoint.year}</span>` +
      `<br /><span style="color: ${GovukColours.Black}; font-size: large;">${SymbolsEnum.MultiplicationX}</span>` +
      `<span>${formatNumber(mockHcPoint.value)} mock units</span>` +
      `<br /><span>${mockHcPoint.benchmarkComparisonOutcome} than England</span><br /><span>(95%)</span>`;
    expect(actual).toEqual(expectedAreaToolTip);
  });
  it('should return the expected tooltip for an area and group', () => {
    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      undefined,
      mockGroupDataForYear,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(expectedGroupTooltip + expectedAreaTooltip);
  });
  it('should return the expected tooltip for an area and group for an area where benchmarking outcome is "not compared"', () => {
    const mockGroupDataForYear: HealthDataForArea = {
      ...mockHealthData[108][1],
      healthData: [
        {
          ...mockHealthData[108][1].healthData[0],
          benchmarkComparison: { outcome: 'NotCompared' },
        },
      ],
    };

    const expectedGroupTooltip =
      `<br /><span style=\"font-weight: bold\">Group: ${mockGroupDataForYear.areaName}</span>` +
      `<br /><span>${mockGroupDataForYear.healthData[0].year}</span><br />` +
      `<span style=\"color: ${GovukColours.Black}; font-size: large;\">${SymbolsEnum.MultiplicationX}</span>` +
      `<span>${formatNumber(mockGroupDataForYear.healthData[0].value)} mock units</span>` +
      `<br /><span>${mockGroupDataForYear.healthData[0].benchmarkComparison?.outcome} than England</span><br /><span>(95%)</span>`;

    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      undefined,
      mockGroupDataForYear,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(expectedGroupTooltip + expectedAreaTooltip);
  });
  it('should return the expected tootip for an area and benchmark', () => {
    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      mockBenchmarkDataForYear,
      undefined,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(expectedBenchmarkTooltip + expectedAreaTooltip);
  });
  it('should return the expected tootip for an area, group and benchmark', () => {
    const actual = generateThematicMapTooltipString(
      mockHcPoint,
      mockBenchmarkDataForYear,
      mockGroupDataForYear,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(
      expectedBenchmarkTooltip + expectedGroupTooltip + expectedAreaTooltip
    );
  });
});
