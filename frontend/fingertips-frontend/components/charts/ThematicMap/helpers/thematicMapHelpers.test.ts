import regionsMap from '@/components/charts/ThematicMap/regions.json';
import {
  getMapGeographyData,
  prepareThematicMapSeriesData,
  thematicMapTitle,
} from './thematicMapHelpers';
import { mockMapRegionBoundaries } from '@/mock/data/mapGroupBoundaries';
import {
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';

import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';

describe('getMapGeographyData', () => {
  it('should return an object with the expected mapGroupBoundary', () => {
    const areaType = 'regions';
    const areaCodes = ['E12000008', 'E12000009'];
    const actual = getMapGeographyData(areaType, areaCodes, regionsMap);
    expect(actual.mapGroupBoundary).toEqual(mockMapRegionBoundaries);
  });
});

describe('prepareThematicMapSeriesData', () => {
  it('should return the expected series data, for the most recent year', () => {
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

    const actual = prepareThematicMapSeriesData(mockHealthData);
    expect(actual).toEqual(expected);
  });

  it('should return the expected series data, for areas with no data', () => {
    const actual = prepareThematicMapSeriesData([
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
            benchmarkComparison: { outcome: 'NotCompared' },
            deprivation: noDeprivation,
          },
          {
            year: 2018,
            value: 767.343,
            ageBand: allAgesAge,
            sex: personsSex,
            trend: HealthDataPointTrendEnum.CannotBeCalculated,
            benchmarkComparison: { outcome: 'Lower' },
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'Code1',
        areaName: 'Area 1',
        healthData: [],
      },
    ]);

    const expected = [
      {
        areaCode: 'E12000001',
        areaName: 'North East region (statistical)',
        value: 767.343,
        year: 2018,
        benchmarkComparisonOutcome: BenchmarkOutcome.Lower,
        benchmarkColourCode: 45,
      },
      {
        areaName: 'Area 1',
        areaCode: 'Code1',
        value: undefined,
        year: undefined,
        benchmarkComparisonOutcome: BenchmarkOutcome.NotCompared,
        benchmarkColourCode: 5,
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe('thematicMapTitle', () => {
  it('should return the title for regions in the North West', () => {
    const indicatorName = 'Indicator';
    const selectedAreaType = 'regions';
    const groupData = mockHealthDataForArea_Group();
    const healthIndicatorData = mockHealthDataForArea();

    const result = thematicMapTitle(
      indicatorName,
      selectedAreaType,
      groupData,
      [healthIndicatorData]
    );
    expect(result).toEqual(
      `${indicatorName} for Regions in ${groupData.areaName}, ${healthIndicatorData.healthData[0].year}`
    );
  });

  it('should return the title for regions if there is no group', () => {
    const indicatorName = 'Indicator';
    const selectedAreaType = 'regions';
    const groupData = undefined;
    const healthIndicatorData = mockHealthDataForArea();
    const result = thematicMapTitle(
      indicatorName,
      selectedAreaType,
      groupData,
      [healthIndicatorData]
    );
    expect(result).toEqual(
      `${indicatorName} for Regions in England, ${healthIndicatorData.healthData[0].year}`
    );
  });

  it('should return the title for the latest year data', () => {
    const indicatorName = 'Heart attacks';
    const selectedAreaType = 'counties-and-unitary-authorities';
    const groupData = undefined;
    const healthIndicatorData = mockHealthDataForArea({
      healthData: [
        mockHealthDataPoint({ year: 2020 }),
        mockHealthDataPoint({ year: 2022 }),
        mockHealthDataPoint({ year: 2021 }),
      ],
    });
    const result = thematicMapTitle(
      indicatorName,
      selectedAreaType,
      groupData,
      [healthIndicatorData]
    );
    expect(result).toEqual(
      `${indicatorName} for Counties and Unitary Authorities in England, 2022`
    );
  });

  it('should return empty string if there is no areaType', () => {
    const indicatorName = 'Indicator';
    const selectedAreaType = 'mountains';
    const groupData = undefined;
    const healthIndicatorData = mockHealthDataForArea();
    const result = thematicMapTitle(
      indicatorName,
      selectedAreaType,
      groupData,
      [healthIndicatorData]
    );
    expect(result).toEqual('');
  });

  it('should return empty string if there is no health data points', () => {
    const indicatorName = 'indicator';
    const selectedAreaType = 'counties-and-unitary-authorities';
    const groupData = undefined;
    const healthIndicatorData = mockHealthDataForArea({ healthData: [] });
    const result = thematicMapTitle(
      indicatorName,
      selectedAreaType,
      groupData,
      [healthIndicatorData]
    );
    expect(result).toEqual('');
  });
});
