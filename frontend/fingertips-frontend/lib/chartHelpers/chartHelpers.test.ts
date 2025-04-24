import {
  getHealthDataWithoutInequalities,
  getMostRecentData,
  isEnglandSoleSelectedArea,
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
  sortHealthDataByYearDescending,
  sortHealthDataForAreasByDate,
  sortHealthDataPointsByDescendingYear,
  getIndicatorDataForAreasForMostRecentYearOnly,
  seriesDataWithoutGroup,
  determineHealthDataForArea,
  AreaTypeLabelEnum,
  getTooltipContent,
  createTooltipHTML,
  getLatestYear,
  getFirstYear,
  getLatestYearForAreas,
  getFirstYearForAreas,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';
import { areaCodeForEngland } from './constants';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
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

describe('getIndicatorDataForAreasForMostRecentYearOnly', () => {
  const mockHealthData: HealthDataForArea[] = [
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 2008,
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
          year: 2004,
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
          year: 2004,
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
          year: 2012,
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
          year: 2006,
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
          year: 2020,
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
          year: 2004,
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
          year: 2006,
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
          year: 2008,
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
          year: 2012,
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
          year: 2006,
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
          year: 2020,
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
          year: 2004,
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
          year: 2008,
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
          year: 2012,
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
          year: 2020,
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
          year: 2008,
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
          year: 2012,
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
          year: 2004,
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
          year: 2006,
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
          year: 2020,
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
          year: 2004,
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
          year: 2006,
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
          year: 2012,
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
          year: 2008,
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
          year: 2006,
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
          year: 2012,
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
          year: 2008,
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
          year: 2020,
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
          year: 2004,
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
      getIndicatorDataForAreasForMostRecentYearOnly(mockHealthData);
    expect(actual).toEqual(expected);
  });

  it('should return undefined if there are no areas with data', () => {
    const actual = getIndicatorDataForAreasForMostRecentYearOnly([
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
          period: 2004,
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
          period: 2004,
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

describe('getFirstYear', () => {
  it('should return the first year for an area', () => {
    expect(getFirstYear(mockData[0].healthData)).toBe(2004);
  });
});

describe('getLatestYearForAreas', () => {
  it('should return the latest year for a group of areas', () => {
    expect(getLatestYearForAreas(mockData)).toBe(2006);
  });

  it('should return undefined when the data provided is an empty list', () => {
    expect(getLatestYearForAreas([])).toBeUndefined();
  });
});

describe('getFirstYearForAreas', () => {
  it('should return the latest year for a group of areas', () => {
    expect(getFirstYearForAreas(mockData)).toBe(2004);
  });

  // This can occur when no area is selected. When undefined is returned, the chart min/max
  // simply use those of the default benchmark i.e. England
  it('should return undefined when the data provided is an empty list', () => {
    expect(getFirstYearForAreas([])).toBeUndefined();
  });
});
