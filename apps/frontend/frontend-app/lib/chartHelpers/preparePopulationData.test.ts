import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  computeDataPercentages,
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

describe('computeDataPercentages', () => {
  const mockFemalePercentageSeries = [
    1.58, 2.48, 8.78, 7.67, 7.49, 7.81, 7.42, 6.78,
  ];
  const mockMalePercentageSeries = [
    0.79, 1.71, 8.49, 7.99, 7.95, 8.19, 7.77, 7.11,
  ];

  it('check compute percentage matches series expected values ', () => {
    const expectedFemaleSeries = [
      347835, 547342, 1936763, 1692751, 1652231, 1721746, 1635842, 1496012,
    ];

    const expectedMaleSeries = [
      173456, 377979, 1872253, 1763621, 1752832, 1807194, 1712925, 1568625,
    ];

    let total = expectedFemaleSeries.reduce((prev, value) => {
      return (prev ?? 0) + (value ?? 0);
    }, 0);

    total = expectedMaleSeries.reduce((prev, value) => {
      return (prev ?? 0) + (value ?? 0);
    }, total);

    const femaleSeries = computeDataPercentages(expectedFemaleSeries, total);
    const maleSeries = computeDataPercentages(expectedMaleSeries, total);
    expect(femaleSeries).toEqual(mockFemalePercentageSeries);
    expect(maleSeries).toEqual(mockMalePercentageSeries);
  });

  it('check for empty list data returns an empty list', () => {
    expect(computeDataPercentages([], 0)).toHaveLength(0);
  });
});

describe('convertHealthDataForAreaForPyramidData', () => {
  it('should return the correct data points for female, male and categories', () => {
    const mockHealthDataForArea: HealthDataForArea = {
      areaCode: 'selected',
      areaName: 'Selected Area',
      healthData: mockData,
    };
    const expectedFemaleSeries = [
      347835, 547342, 1936763, 1692751, 1652231, 1721746, 1635842, 1496012,
    ];

    const expectedMaleSeries = [
      173456, 377979, 1872253, 1763621, 1752832, 1807194, 1712925, 1568625,
    ];

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
    expect(actual?.femaleSeries).toEqual(expectedFemaleSeries);
    expect(actual?.maleSeries).toEqual(expectedMaleSeries);
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
