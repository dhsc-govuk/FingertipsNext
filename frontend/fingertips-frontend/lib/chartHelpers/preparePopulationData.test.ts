import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from './preparePopulationData';
import { disaggregatedAge, femaleSex, maleSex, noDeprivation } from '../mocks';

const mockData: HealthDataPoint[] = [
  {
    year: 2023,
    count: 1496012,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('0-4'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1635842,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('5-9'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1721746,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('10-14'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1652231,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('15-19'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1692751,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('20-24'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1936763,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('50-54'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 547342,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('85-89'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 347835,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('90+'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1568625,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('0-4'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1712925,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('5-9'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1807194,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('10-14'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1752832,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('15-19'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1763621,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('20-24'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1872253,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('50-54'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },

  {
    year: 2023,
    count: 173456,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('90+'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 377979,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('85-89'),
    sex: maleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
];

describe('convertHealthDataForAreaForPyramidData', () => {
  it('should return the correct data points for female, male and categories', () => {
    const mockHealthDataForArea: HealthDataForArea = {
      areaCode: 'selected',
      areaName: 'Selected Area',
      healthData: mockData,
    };

    const mockFemaleSeries = [1.58, 2.48, 8.78, 7.67, 7.49, 7.81, 7.42, 6.78];
    const mockMaleSeries = [0.79, 1.71, 8.49, 7.99, 7.95, 8.19, 7.77, 7.11];
    const mockAgeCategories = [
      '90+',
      '85-89',
      '50-54',
      '20-24',
      '15-19',
      '10-14',
      '5-9',
      '0-4',
    ].map((value) => value.replace('-', ' to '));

    const actual: PopulationDataForArea | undefined =
      convertHealthDataForAreaForPyramidData(mockHealthDataForArea, 2023);
    expect(actual?.femaleSeries).toEqual(mockFemaleSeries);
    expect(actual?.maleSeries).toEqual(mockMaleSeries);
    expect(actual?.ageCategories).toEqual(mockAgeCategories);
  });

  it('should return undefined if the HealthDataForArea provided is undefined', () => {
    const actual = convertHealthDataForAreaForPyramidData(undefined, undefined);
    expect(actual).toBeUndefined();
  });

  it('should remove duplicate age bands and data point', () => {
    const mockDataPoint: HealthDataPoint[] = [
      {
        year: 2023,
        count: 1496012,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: disaggregatedAge('10-14'),
        sex: femaleSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
      {
        year: 2023,
        count: 1635842,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: disaggregatedAge('10-14'),
        sex: femaleSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
      {
        year: 2023,
        count: 1721746,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: disaggregatedAge('10-14'),
        sex: maleSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ];

    const mockDuplicateData: HealthDataForArea = {
      areaCode: 'selected',
      areaName: 'Selected Area',
      healthData: mockDataPoint,
    };
    const actual: PopulationDataForArea | undefined =
      convertHealthDataForAreaForPyramidData(mockDuplicateData, 2023);
    expect(actual?.femaleSeries).toHaveLength(1);
    expect(actual?.maleSeries).toHaveLength(1);
  });
});
