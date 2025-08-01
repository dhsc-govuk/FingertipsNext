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
import {
  disaggregatedAge,
  femaleSex,
  maleSex,
  noDeprivation,
} from '../../../../lib/mocks';
import {
  mockHealthDataPoint,
  mockHealthDataPoints,
} from '@/mock/data/mockHealthDataPoint';
import {
  mockHealthDataForArea as localMockHealthDataForArea,
  mockHealthDataForArea,
} from '@/mock/data/mockHealthDataForArea';
import { mock } from 'node:test';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';

const mockData: HealthDataPoint[] = [
  mockHealthDataPoint({
    count: 1496012,
    ageBand: disaggregatedAge('0-4'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    count: 1635842,
    ageBand: disaggregatedAge('5-9'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    count: 1721746,
    ageBand: disaggregatedAge('10-14'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    count: 1652231,
    ageBand: disaggregatedAge('15-19'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  }),
  mockHealthDataPoint({
    count: 1692751,
    ageBand: disaggregatedAge('20-24'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1936763,
    ageBand: disaggregatedAge('50-54'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 547342,
    ageBand: disaggregatedAge('85-89'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 347835,
    ageBand: disaggregatedAge('90+'),
    sex: femaleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1568625,
    ageBand: disaggregatedAge('0-4'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1712925,
    ageBand: disaggregatedAge('5-9'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1807194,
    ageBand: disaggregatedAge('10-14'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1752832,
    ageBand: disaggregatedAge('15-19'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1763621,
    ageBand: disaggregatedAge('20-24'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 1872253,
    ageBand: disaggregatedAge('50-54'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 173456,
    ageBand: disaggregatedAge('90+'),
    sex: maleSex,
  }),
  mockHealthDataPoint({
    year: 2023,
    count: 377979,
    ageBand: disaggregatedAge('85-89'),
    sex: maleSex,
  }),
];
const localMockHealthDataForArea: HealthDataForArea = {
  areaCode: 'selected',
  areaName: 'Selected Area',
  healthData: mockData,
};

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

    let totalPopulation = expectedFemaleSeries.reduce((prev, value) => {
      return (prev ?? 0) + (value ?? 0);
    }, 0);

    totalPopulation = expectedMaleSeries.reduce((prev, value) => {
      return (prev ?? 0) + (value ?? 0);
    }, totalPopulation);

    const femaleSeries = computeDataPercentages(
      expectedFemaleSeries,
      totalPopulation
    );
    const maleSeries = computeDataPercentages(
      expectedMaleSeries,
      totalPopulation
    );
    expect(femaleSeries).toEqual(mockFemalePercentageSeries);
    expect(maleSeries).toEqual(mockMalePercentageSeries);
  });

  it('check for empty list data returns an empty list', () => {
    expect(computeDataPercentages([], 0)).toHaveLength(0);
  });
});

describe('convertHealthDataForAreaForPyramidData', () => {
  it('should return the correct data points for female, male and categories', () => {
    const expectedFemaleSeries = [
      347835, 547342, 1936763, 1692751, 1652231, 1721746, 1635842, 1496012,
    ];

    const expectedMaleSeries = [
      173456, 377979, 1872253, 1763621, 1752832, 1807194, 1712925, 1568625,
    ];

    const mockAgeCategories = [
      '90+',
      '85 to 89',
      '50 to 54',
      '20 to 24',
      '15 to 19',
      '10 to 14',
      '5 to 9',
      '0 to 4',
    ];

    const actual = convertHealthDataForAreaForPyramidData(
      localMockHealthDataForArea
    );
    expect(actual?.femaleSeries).toEqual(expectedFemaleSeries); // fails as rafactor to use segements
    expect(actual?.maleSeries).toEqual(expectedMaleSeries);
    expect(actual?.ageCategories).toEqual(mockAgeCategories);
  });

  it('should return undefined if the HealthDataForArea provided is undefined', () => {
    const actual = convertHealthDataForAreaForPyramidData(undefined);
    expect(actual).toBeUndefined();
  });

  it('should return undefined if there is more than one year of data for an area', () => {
    const localMockHealthDataForArea = mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPoints([2022, 2023]),
        }),
      ],
    });

    const actual = convertHealthDataForAreaForPyramidData(
      localMockHealthDataForArea
    );
    expect(actual).toBeUndefined();
  });
  it.todo(
    'should return the group &| england only if the period matches the area'
  );
});
