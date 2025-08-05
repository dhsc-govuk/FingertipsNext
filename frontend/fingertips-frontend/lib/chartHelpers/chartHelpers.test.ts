import {
  getHealthDataWithoutInequalities,
  getMostRecentData,
  isEnglandSoleSelectedArea,
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
  sortHealthDataByYearDescending,
  sortHealthDataForAreasByDate,
  sortHealthDataPointsByDescendingYear,
  seriesDataWithoutGroup,
  determineHealthDataForArea,
  AreaTypeLabelEnum,
  getTooltipContent,
  createTooltipHTML,
  getLatestYear,
  getFormattedLabel,
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
  getLatestPeriod,
  getFirstPeriod,
  getLatestPeriodForAreas,
  getFirstPeriodForAreas,
  getIndicatorDataForAreasForMostRecentPeriodOnly,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';
import { areaCodeForEngland } from './constants';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import {
  allAgesAge,
  disaggregatedAge,
  femaleSex,
  maleSex,
  noDeprivation,
  personsSex,
} from '../mocks';
import {
  generateHealthDataPoint,
  generateMockHealthDataForArea,
} from './testHelpers';
import { ALL_AREAS_SELECTED } from '../areaFilterHelpers/constants';
import { convertDateToNumber } from '../timePeriodHelpers/getTimePeriodLabels';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

const mockData: HealthDataForArea[] = [
  {
    areaCode: 'A1425',
    areaName: 'North FooBar',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2006-01-01'),
          to: new Date('2006-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: true,
        deprivation: noDeprivation,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: true,
        deprivation: noDeprivation,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        sex: maleSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: false,
        deprivation: noDeprivation,
      },
    ],
  },
];

describe('sortHealthDataByDate', () => {
  it('should sort the healthcare data values in ascending year', () => {
    const mockSortedData: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'North FooBar',
        healthData: [
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2004-01-01'),
              to: new Date('2004-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: true,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2004-01-01'),
              to: new Date('2004-12-31'),
            },
            sex: maleSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: false,
            deprivation: noDeprivation,
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2006-01-01'),
              to: new Date('2006-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: true,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const result = sortHealthDataForAreasByDate(mockData);
    expect(result).toEqual(mockSortedData);
  });
});

describe('sortHealthDataByYearDescending', () => {
  it('should sort the healthcare data  in descending years', () => {
    const mockData: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2004-01-01'),
              to: new Date('2004-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2006-01-01'),
              to: new Date('2006-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];
    const mockSortedData: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2006-01-01'),
              to: new Date('2006-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            datePeriod: {
              type: PeriodType.Calendar,
              from: new Date('2004-01-01'),
              to: new Date('2004-12-31'),
            },
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const result = sortHealthDataByYearDescending(mockData);
    expect(result).toEqual(mockSortedData);
  });
});

describe('sortHealthDataPointsByDescendingYear', () => {
  it('should sort the health data points by descending year', () => {
    const mockHealthDataPoints: HealthDataPoint[] = [
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2006-01-01'),
          to: new Date('2006-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ];

    const mockSortedHealthDataPoints: HealthDataPoint[] = [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2006-01-01'),
          to: new Date('2006-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        datePeriod: {
          type: PeriodType.Calendar,
          from: new Date('2004-01-01'),
          to: new Date('2004-12-31'),
        },
        sex: personsSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ];

    const result = sortHealthDataPointsByDescendingYear(mockHealthDataPoints);
    expect(result).toEqual(mockSortedHealthDataPoints);
  });

  it('should return an empty array when the health point data is undefined', () => {
    const result = sortHealthDataPointsByDescendingYear(undefined);
    expect(result).toEqual([]);
  });
});

describe('seriesDataForIndicatorIndexAndArea', () => {
  it('should find data for specified area and indicator id', () => {
    const data = [mockHealthData['337'], mockHealthData['1']];

    expect(
      seriesDataForIndicatorIndexAndArea(data, 0, areaCodeForEngland)
    ).toEqual(mockHealthData['337'][0]);
    expect(
      seriesDataForIndicatorIndexAndArea(data, 1, areaCodeForEngland)
    ).toEqual(mockHealthData['1'][1]);
  });
});

describe('seriesDataWithoutEnglandOrParent', () => {
  it('should return data that doesnt have the england area code', () => {
    const data: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'E92000001',
        areaName: 'England',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const dataWithoutEngland: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const result = seriesDataWithoutEnglandOrGroup(data);
    expect(result).toEqual(dataWithoutEngland);
  });

  it('should return data that doesnt have the parent area code when passed a parent area code', () => {
    const data: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'E12000001',
        areaName: 'North East region',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const dataWithoutParent: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'area A1425',
        healthData: [
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: personsSex,
            ageBand: allAgesAge,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ];

    const result = seriesDataWithoutEnglandOrGroup(data, 'E12000001');
    expect(result).toEqual(dataWithoutParent);
  });
});

describe('seriesDataWithoutGroup', () => {
  const mockHealthDataForArea1 = generateMockHealthDataForArea('A001', [
    generateHealthDataPoint(2024, false, false),
    generateHealthDataPoint(2024, false, false),
  ]);

  const mockHealthDataForArea2 = generateMockHealthDataForArea('A002', [
    generateHealthDataPoint(2024, false, false),
    generateHealthDataPoint(2024, false, false),
  ]);

  const mockHealthDataForEngland = generateMockHealthDataForArea(
    areaCodeForEngland,
    [
      generateHealthDataPoint(2024, false, false),
      generateHealthDataPoint(2024, false, false),
    ]
  );

  it('should return data that does not have the group area code', () => {
    const result = seriesDataWithoutGroup(
      [
        mockHealthDataForEngland,
        mockHealthDataForArea1,
        mockHealthDataForArea2,
      ],
      'A002'
    );
    expect(result).toEqual([mockHealthDataForArea1, mockHealthDataForEngland]);
  });

  it('should sort the provided healthDataForAreas alphabetically of the area names', () => {
    const result = seriesDataWithoutGroup([
      mockHealthDataForEngland,
      mockHealthDataForArea1,
      mockHealthDataForArea2,
    ]);
    expect(result).toEqual([
      mockHealthDataForArea1,
      mockHealthDataForArea2,
      mockHealthDataForEngland,
    ]);
  });

  it('should return data with england as the last area when specified', () => {
    const MOVE_ENGLAND_LAST = true;

    const result = seriesDataWithoutGroup(
      [
        mockHealthDataForEngland,
        mockHealthDataForArea1,
        mockHealthDataForArea2,
      ],
      'A002',
      MOVE_ENGLAND_LAST
    );
    expect(result).toEqual([mockHealthDataForArea1, mockHealthDataForEngland]);
  });
});

describe('determineHealthDataForArea', () => {
  const mockHealthDataForArea1 = generateMockHealthDataForArea('A001', [
    generateHealthDataPoint(2024, false, false),
    generateHealthDataPoint(2024, false, false),
  ]);

  const mockHealthDataForArea2 = generateMockHealthDataForArea('A002', [
    generateHealthDataPoint(2024, false, false),
    generateHealthDataPoint(2024, false, false),
  ]);

  const mockHealthDataForEngland = generateMockHealthDataForArea(
    areaCodeForEngland,
    [
      generateHealthDataPoint(2024, false, false),
      generateHealthDataPoint(2024, false, false),
    ]
  );

  const mockDataForAreas = [
    mockHealthDataForArea1,
    mockHealthDataForArea2,
    mockHealthDataForEngland,
  ];

  it('should return the healthData for the area found with the areaToFind param', () => {
    const result = determineHealthDataForArea(mockDataForAreas, 'A002');

    expect(result).toEqual(mockHealthDataForArea2);
  });

  it('should return undefined when the areaToFind is not found', () => {
    const result = determineHealthDataForArea(mockDataForAreas, 'A003');

    expect(result).toEqual(undefined);
  });

  it('should return the first area from the healthDataForAllAreas array when an areaToFind is not provided', () => {
    const result = determineHealthDataForArea(mockDataForAreas);

    expect(result).toEqual(mockHealthDataForArea1);
  });
});

describe('isEnglandSoleSelectedArea', () => {
  it('should return false', () => {
    expect(isEnglandSoleSelectedArea(['E92000001', 'E12000001'])).toBe(false);
  });

  it('should return true', () => {
    expect(isEnglandSoleSelectedArea(['E92000001'])).toBe(true);
  });

  it('should return true when England duplicated', () => {
    expect(isEnglandSoleSelectedArea(['E92000001', 'E92000001'])).toBe(true);
  });
});

describe('getMostRecentDataFromSorted', () => {
  it('should return the most recent health data point from data sorted by year', () => {
    const result = getMostRecentData(mockData[0].healthData);
    const expected: HealthDataPoint = {
      ageBand: allAgesAge,
      count: 389,
      deprivation: noDeprivation,
      isAggregate: true,
      sex: personsSex,
      trend: 'Not yet calculated',
      value: 278.29134,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      year: 2006,
      datePeriod: {
        type: PeriodType.Calendar,
        from: new Date('2006-01-01'),
        to: new Date('2006-12-31'),
      },
    };

    expect(result).toEqual(expected);
  });

  it('should return undefined when there is no data passed', () => {
    const result = getMostRecentData([]);

    expect(result).toEqual(undefined);
  });
});

describe('getHealthDataWithoutInequalities', () => {
  it('should return health data without inequalities', () => {
    expect(getHealthDataWithoutInequalities(mockData[0])).toEqual(
      mockData[0].healthData.slice(0, 2)
    );
  });
});

describe('getIndicatorDataForAreasForMostRecentPeriodOnly', () => {
  const mockHealthData: HealthDataForArea[] = [
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 222,
          value: 890.305692,
          lowerCi: 821.987617,
          upperCi: 958.623767,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 267,
          value: 703.420759,
          lowerCi: 635.102684,
          upperCi: 771.738834,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: femaleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 300,
          value: 602.820845,
          lowerCi: 534.50277,
          upperCi: 671.13892,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 389,
          value: 278.29134,
          lowerCi: 209.973265,
          upperCi: 346.609415,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2020),
          count: 200,
          value: 971.435418,
          lowerCi: 903.117343,
          upperCi: 1039.753493,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'E92000001',
      areaName: 'England',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 200,
          value: 904.874,
          lowerCi: 0,
          upperCi: 0,
          ageBand: disaggregatedAge('0-4'),
          sex: femaleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 179,
          value: 709.7645,
          lowerCi: 0,
          upperCi: 0,
          ageBand: disaggregatedAge('5-9'),
          sex: femaleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 500,
          value: 965.9843,
          lowerCi: 0,
          upperCi: 0,
          ageBand: disaggregatedAge('10-14'),
          sex: femaleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 400,
          value: 908.8475,
          lowerCi: 0,
          upperCi: 0,
          ageBand: disaggregatedAge('15-19'),
          sex: femaleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1426',
      areaName: 'South FooBar',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 157,
          value: 723.090354,
          lowerCi: 612.272279,
          upperCi: 833.908429,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2020),
          count: 256,
          value: 905.145997,
          lowerCi: 833.327922,
          upperCi: 976.964072,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 222,
          value: 135.149304,
          lowerCi: 85.331229,
          upperCi: 184.967379,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 131,
          value: 890.328253,
          lowerCi: 829.010178,
          upperCi: 951.646328,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 452,
          value: 478.996862,
          lowerCi: 404.178787,
          upperCi: 553.814937,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1427',
      areaName: 'Area 1427',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2020),
          count: 411,
          value: 579.848756,
          lowerCi: 515.030681,
          upperCi: 644.666831,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 367,
          value: 383.964067,
          lowerCi: 334.145992,
          upperCi: 433.782142,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 289,
          value: 851.163104,
          lowerCi: 777.34503,
          upperCi: 924.981179,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 356,
          value: 775.129883,
          lowerCi: 725.311808,
          upperCi: 824.947958,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 489,
          value: 290.465304,
          lowerCi: 190.647229,
          upperCi: 390.283379,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1428',
      areaName: 'Area 1428',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2020),
          count: 311,
          value: 400.848756,
          lowerCi: 312.030681,
          upperCi: 489.666831,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 469,
          value: 320.964067,
          lowerCi: 271.145992,
          upperCi: 370.782142,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 120,
          value: 600.163104,
          lowerCi: 550.34503,
          upperCi: 649.981179,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 250,
          value: 650.129883,
          lowerCi: 561.311808,
          upperCi: 738.947958,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 344,
          value: 500.650389,
          lowerCi: 440.832314,
          upperCi: 560.468464,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    {
      areaCode: 'A1429',
      areaName: 'Area 1429',
      healthData: [
        {
          year: 0,
          datePeriod: mockDatePeriod(2006),
          count: 322,
          value: 472.650389,
          lowerCi: 404.332314,
          upperCi: 540.968464,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2012),
          count: 234,
          value: 472.7613425,
          lowerCi: 404.443268,
          upperCi: 541.079418,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2008),
          count: 299,
          value: 582.306765,
          lowerCi: 513.98869,
          upperCi: 650.62484,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2020),
          count: 435,
          value: 563.4002,
          lowerCi: 495.082125,
          upperCi: 631.718275,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
        {
          year: 0,
          datePeriod: mockDatePeriod(2004),
          count: 277,
          value: 627.899536,
          lowerCi: 559.581462,
          upperCi: 696.217611,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
  ];

  const expected: HealthDataForArea[] = [
    {
      ...mockHealthData[0],
      healthData: [
        {
          ...mockHealthData[0].healthData[5],
        },
      ],
    },
    {
      ...mockHealthData[1],
      healthData: [],
    },
    {
      ...mockHealthData[2],
      healthData: [
        {
          ...mockHealthData[2].healthData[1],
        },
      ],
    },
    {
      ...mockHealthData[3],
      healthData: [
        {
          ...mockHealthData[3].healthData[0],
        },
      ],
    },
    {
      ...mockHealthData[4],
      healthData: [
        {
          ...mockHealthData[4].healthData[0],
        },
      ],
    },
    {
      ...mockHealthData[5],
      healthData: [
        {
          ...mockHealthData[5].healthData[3],
        },
      ],
    },
  ];
  it('should return healthdata for all areas, only for the most reccent year', () => {
    const actual =
      getIndicatorDataForAreasForMostRecentPeriodOnly(mockHealthData);
    expect(actual).toEqual(expected);
  });

  it('should return undefined if there are no areas with data', () => {
    const actual = getIndicatorDataForAreasForMostRecentPeriodOnly([
      {
        areaCode: 'missingCode',
        areaName: 'missing Area',
        healthData: [],
      },
    ]);

    expect(actual).toBeUndefined();
  });
});

describe('getTooltipContent', () => {
  it('should return the category "Benchmark" prefix and an empty benchmark label when benchmark data is present', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Benchmark,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: '',
      category: 'Benchmark: ',
      comparisonLabel: '',
    });
  });

  it('should return the category "Group" prefix when group data is present', () => {
    const benchmarkOutcome = BenchmarkOutcome.NotCompared;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Group,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: '',
      category: 'Group: ',
      comparisonLabel: '',
    });
  });

  it('should return "Similar to England" benchmark label when the benchmark outcome is Similar', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: 'Similar to England',
      category: '',
      comparisonLabel: '(95%)',
    });
  });

  it('should return the area name in the benchmark label if provided', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod,
      'Bolton'
    );

    expect(result).toEqual({
      benchmarkLabel: 'Similar to Bolton',
      category: '',
      comparisonLabel: '(95%)',
    });
  });

  it('should return comparison label of "95%" when benchmark comparison method is CIOverlappingReferenceValue95', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: 'Similar to England',
      category: '',
      comparisonLabel: '(95%)',
    });
  });

  it('should not return a comparison label or benchmark label when the benchmark outcome method of "Not compared" is passed in', () => {
    const benchmarkOutcome = BenchmarkOutcome.NotCompared;
    const benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Benchmark,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: '',
      category: 'Benchmark: ',
      comparisonLabel: '',
    });
  });

  it('should return a comparisonLabel, category and benchmarkLabel when areaName is passed in', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod,
      'London'
    );

    expect(result).toEqual({
      benchmarkLabel: 'Similar to London',
      category: '',
      comparisonLabel: '(95%)',
    });
  });

  it('should return an empty string for benchmarkLabel, category and comparisonLabel when showComparisonLabels = false is passed in', () => {
    const benchmarkOutcome = BenchmarkOutcome.Similar;
    const benchmarkComparisonMethod =
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod,
      'London',
      false
    );

    expect(result).toEqual({
      benchmarkLabel: '',
      category: '',
      comparisonLabel: '',
    });
  });

  it('should return tooltip for quintiles with no CI% shown', () => {
    const benchmarkOutcome = BenchmarkOutcome.Worse;
    const benchmarkComparisonMethod = BenchmarkComparisonMethod.Quintiles;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: 'Worse quintile',
      category: '',
      comparisonLabel: '',
    });
  });

  it('should return Not compared when the benchmark outcome method of "Not compared" is passed in', () => {
    const benchmarkOutcome = BenchmarkOutcome.NotCompared;
    const benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown;

    const result = getTooltipContent(
      benchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: 'Not compared',
      category: '',
      comparisonLabel: '',
    });
  });

  it('should just return "Not compared" when the Benchmark outcome is not valid', () => {
    const benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown;

    const result = getTooltipContent(
      'some-invalid-type' as BenchmarkOutcome,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod
    );

    expect(result).toEqual({
      benchmarkLabel: 'Not compared',
      category: '',
      comparisonLabel: '',
    });
  });
});

describe('getTooltipHtml', () => {
  it('should return expected html list with benchmark', () => {
    const expected = [
      `<div style="padding-right: 25px">
        <span style="font-weight: bold; display: block">North</span>
        <span style="display: block">2004</span>
        <span style="display: block">Male</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;">symbolLine</div>
          <div style="padding-right: 10px;">
            <span style="display: block">278.3%</span>
            <span style="display: block">Better than England</span>
            <span style="display: block">persons (95%)</span>
          </div>
        </div>
      </div>`,
    ];

    expect(
      createTooltipHTML(
        {
          areaName: 'North',
          period: '2004',
          fieldName: 'Male',
          benchmarkComparisonSymbol: 'symbolLine',
          shouldHideComparison: false,
          benchmarkLabel: 'Better than England',
          comparisonLabel: '(95%)',
        },
        mockData[0].healthData[0].value,
        '%'
      )
    ).toEqual(expected);
  });

  it('should return expected html list without benchmark', () => {
    const expected = [
      `<div style="padding-right: 25px">
        <span style="font-weight: bold; display: block">North</span>
        <span style="display: block">2004</span>
        <span style="display: block">Male</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;">symbolLine</div>
          <div style="padding-right: 10px;">
            <span style="display: block">278.3%</span>
            ${''}
            ${''}
          </div>
        </div>
      </div>`,
    ];

    expect(
      createTooltipHTML(
        {
          areaName: 'North',
          period: '2004',
          fieldName: 'Male',
          benchmarkComparisonSymbol: 'symbolLine',
          shouldHideComparison: true,
          benchmarkLabel: 'Better than England',
          comparisonLabel: '(95%)',
        },
        mockData[0].healthData[0].value,
        '%'
      )
    ).toEqual(expected);
  });
});

describe('getLatestYear', () => {
  it('should return the latest year for an area', () => {
    expect(getLatestYear(mockData[0].healthData)).toBe(2006);
  });
});

describe('getLatestPeriod', () => {
  it('should return the latest period as an number for an area', () => {
    expect(getLatestPeriod(mockData[0].healthData)).toBe(
      convertDateToNumber('2006-12-31')
    );
  });
});

describe('getFirstPeriod', () => {
  it('should return the first year as an number for an area', () => {
    expect(getFirstPeriod(mockData[0].healthData)).toBe(
      convertDateToNumber('2004-12-31')
    );
  });
});

describe('getLatestPeriodForAreas', () => {
  it('should return the latest period as an number for a group of areas', () => {
    expect(getLatestPeriodForAreas(mockData)).toBe(
      convertDateToNumber('2006-12-31')
    );
  });

  it('should return undefined when the data provided is an empty list', () => {
    expect(getLatestPeriodForAreas([])).toBeUndefined();
  });
});

describe('getFirstPeriodForAreas', () => {
  it('should return the latest year for a group of areas', () => {
    expect(getFirstPeriodForAreas(mockData)).toBe(
      convertDateToNumber('2004-12-31')
    );
  });

  // This can occur when no area is selected. When undefined is returned, the chart min/max
  // simply use those of the default benchmark i.e. England
  it('should return undefined when the data provided is an empty list', () => {
    expect(getFirstPeriodForAreas([])).toBeUndefined();
  });
});

describe('getFormattedLabel', () => {
  it.each([
    [5, '5'],
    [10, '10'],
    [15, '15'],
    [20, '20'],
  ])(
    'should remove the decimal when all the tickpoints are whole numbers',
    (value: number, formattedValue: string) => {
      const tickPoints = [5, 10, 15, 20];

      expect(getFormattedLabel(value, tickPoints)).toBe(formattedValue);
    }
  );

  it.each([
    [5, '5.0'],
    [10, '10.0'],
    [15, '15.0'],
    [20, '20.0'],
  ])(
    'should keep the decimal when a decimal tickpoint exists',
    (value: number, formattedValue: string) => {
      const tickPoints = [5, 10.6, 15, 20];

      expect(getFormattedLabel(value, tickPoints)).toBe(formattedValue);
    }
  );
});

describe('determineAreasForBenchmarking', () => {
  const mockHealthDataForAreas: HealthDataForArea[] = [
    { areaCode: 'A1', areaName: 'Area 1', healthData: [] },
    { areaCode: areaCodeForEngland, areaName: 'England', healthData: [] },
    { areaCode: 'G1', areaName: 'Group 1', healthData: [] },
    { areaCode: 'A2', areaName: 'Area 2', healthData: [] },
  ];

  it('returns only England if present and no group selected', () => {
    const result = determineAreasForBenchmarking(mockHealthDataForAreas);
    expect(result).toEqual([{ code: areaCodeForEngland, name: 'England' }]);
  });

  it('returns England and selected group when a selectedGroupCode and an areaSelected is provided', () => {
    const result = determineAreasForBenchmarking(mockHealthDataForAreas, 'G1', [
      'A0001',
    ]);
    expect(result).toEqual([
      { code: areaCodeForEngland, name: 'England' },
      { code: 'G1', name: 'Group 1' },
    ]);
  });

  it('returns England and not the selected group when an areaSelected is not provided', () => {
    const result = determineAreasForBenchmarking(mockHealthDataForAreas, 'G1');
    expect(result).toEqual([{ code: areaCodeForEngland, name: 'England' }]);
  });

  it('returns England when selected group is England even if areasSelected are provided', () => {
    const result = determineAreasForBenchmarking(
      mockHealthDataForAreas,
      areaCodeForEngland
    );
    expect(result).toEqual([{ code: areaCodeForEngland, name: 'England' }]);
  });

  it('returns England and selected group when a selectedGroupCode is provided and an selectedGroupArea is ALL, so no areas are provided', () => {
    const result = determineAreasForBenchmarking(
      mockHealthDataForAreas,
      'G1',
      [],
      ALL_AREAS_SELECTED
    );
    expect(result).toEqual([
      { code: areaCodeForEngland, name: 'England' },
      { code: 'G1', name: 'Group 1' },
    ]);
  });
});

describe('determineBenchmarkToUse', () => {
  it('should return the lineChartAreaSelected if provided', () => {
    const benchmarkToUse = determineBenchmarkToUse('some-area-selected');

    expect(benchmarkToUse).toEqual('some-area-selected');
  });

  it('should return the areaCodeForEngland when no lineChartAreaSelected param is provided', () => {
    const benchmarkToUse = determineBenchmarkToUse();

    expect(benchmarkToUse).toEqual(areaCodeForEngland);
  });
});
