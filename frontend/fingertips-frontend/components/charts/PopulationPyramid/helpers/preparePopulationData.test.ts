import {
  HealthDataForArea,
  IndicatorSegment,
} from '@/generated-sources/ft-api-client';
import {
  computeDataPercentages,
  convertHealthDataForAreaForPyramidData,
  createPyramidPopulationData,
} from './preparePopulationData';
import { disaggregatedAge, femaleSex, maleSex } from '../../../../lib/mocks';
import {
  mockHealthDataPoint,
  mockHealthDataPoints,
} from '@/mock/data/mockHealthDataPoint';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js';

const mockFemaleSegements: IndicatorSegment[] = [
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('0-4'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1496012,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('5-9'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1635842,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('10-14'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1721746,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('15-19'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1652231,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('20-24'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1692751,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('50-54'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1936763,
      }),
    ],
  }),

  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('85-89'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 547342,
      }),
    ],
  }),

  mockIndicatorSegment({
    sex: femaleSex,
    age: disaggregatedAge('90+'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 347835,
      }),
    ],
  }),
];

const mockMaleSegements: IndicatorSegment[] = [
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('0-4'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1568625,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('5-9'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1712925,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('10-14'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1807194,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('15-19'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1752832,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('20-24'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1763621,
      }),
    ],
  }),
  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('50-54'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 1872253,
      }),
    ],
  }),

  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('85-89'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 377979,
      }),
    ],
  }),

  mockIndicatorSegment({
    sex: maleSex,
    age: disaggregatedAge('90+'),
    healthData: [
      mockHealthDataPoint({
        datePeriod: mockDatePeriod({
          type: 'Calendar',
        }),
        count: 173456,
      }),
    ],
  }),
];

const localMockHealthDataForArea: HealthDataForArea = {
  areaCode: 'selected',
  areaName: 'Selected Area',
  healthData: [],
  indicatorSegments: [...mockFemaleSegements, ...mockMaleSegements],
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
});

describe('createPyramidPopulationData', () => {
  const mockGroupAreaCode = 'E12000002';
  const areasData = [mockHealthDataForArea(), mockHealthDataForArea()];
  it('should return the correct data for areas only', () => {
    const result = createPyramidPopulationData(areasData);

    expect(result?.pyramidDataForAreas).toHaveLength(2);
    expect(result?.pyramidDataForEngland).toBeUndefined();
    expect(result?.pyramidDataForGroup).toBeUndefined();
  });

  it('should return the correct data for england only', () => {
    const areasData = [mockHealthDataForArea_England()];

    const result = createPyramidPopulationData(areasData);

    expect(result?.pyramidDataForAreas).toHaveLength(0);
    expect(result?.pyramidDataForEngland?.areaCode).toBe(areaCodeForEngland);
    expect(result?.pyramidDataForGroup?.areaCode).toBeUndefined();
  });

  it('should return the correct data for group only', () => {
    const areasData = [mockHealthDataForArea_Group()];

    const result = createPyramidPopulationData(areasData, mockGroupAreaCode);

    expect(result?.pyramidDataForAreas).toHaveLength(0);
    expect(result?.pyramidDataForEngland).toBeUndefined();
    expect(result?.pyramidDataForGroup?.areaCode).toBe(mockGroupAreaCode);
  });

  it('should return only benchmark data if the group is england', () => {
    const areasData = [mockHealthDataForArea_England()];

    const result = createPyramidPopulationData(areasData, areaCodeForEngland);

    expect(result?.pyramidDataForAreas).toHaveLength(0);
    expect(result?.pyramidDataForEngland?.areaCode).toBe(areaCodeForEngland);
    expect(result?.pyramidDataForGroup).toBeUndefined();
  });
});
