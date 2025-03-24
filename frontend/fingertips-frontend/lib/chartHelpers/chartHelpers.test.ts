import {
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
  sortHealthDataForAreasByDate,
  sortHealthDataByYearDescending,
  isEnglandSoleSelectedArea,
  sortHealthDataPointsByDescendingYear,
  getMostRecentDataFromSorted,
  getHealthDataWithoutInequalities,
  getHealthDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';
import { areaCodeForEngland } from './constants';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';

const mockData = [
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
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: true,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: true,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Male',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        isAggregate: false,
      },
    ],
  },
];

describe('sortHealthDataByDate', () => {
  it('should sort the healthcare data values in ascending year', () => {
    const mockSortedData = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: true,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Male',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: false,
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            isAggregate: true,
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
    const mockData = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];
    const mockSortedData = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
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
    const mockHealthDataPoints = [
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
    ];

    const mockSortedHealthDataPoints = [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
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
    const data = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];

    const dataWithoutEngland = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];

    const result = seriesDataWithoutEnglandOrGroup(data);
    expect(result).toEqual(dataWithoutEngland);
  });

  it('should return data that doesnt have the parent area code when passed a parent area code', () => {
    const data = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];

    const dataWithoutParent = [
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];

    const result = seriesDataWithoutEnglandOrGroup(data, 'E12000001');
    expect(result).toEqual(dataWithoutParent);
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
    const result = getMostRecentDataFromSorted(mockData[0].healthData);
    const expected = {
      count: 389,
      value: 278.29134,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      year: 2006,
    };

    expect(result).toEqual(expected);
  });

  it('should return undefined when there is no data passed', () => {
    const result = getMostRecentDataFromSorted([]);

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

describe('getGetDataForAreasForMostRecentYearOnly', () => {
  it.only('should return healthdata for all areas, only for the most reccent year', () => {
    const actual = getHealthDataForAreasForMostRecentYearOnly(
      mockHealthData[1]
    );
    const expected: HealthDataForArea[] = [
      {
        areaCode: 'A1425',
        areaName: 'Greater Manchester ICB - 00T',
        healthData: [
          {
            year: 2020,
            count: 200,
            value: 971.435418,
            lowerCi: 903.117343,
            upperCi: 1039.753493,
            ageBand: 'All',
            sex: 'Persons',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
      {
        areaCode: 'E92000001',
        areaName: 'England',
        healthData: [
          {
            year: 2020,
            count: 100,
            value: 734.8973,
            lowerCi: 0,
            upperCi: 0,
            ageBand: '20-24',
            sex: 'Female',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
      {
        areaCode: 'A1426',
        areaName: 'South FooBar',
        healthData: [
          {
            year: 2020,
            count: 256,
            value: 905.145997,
            lowerCi: 833.327922,
            upperCi: 976.964072,
            ageBand: 'All',
            sex: 'Persons',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
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
            ageBand: 'All',
            sex: 'Persons',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
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
            ageBand: 'All',
            sex: 'Persons',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
      {
        areaCode: 'A1429',
        areaName: 'Area 1429',
        healthData: [
          {
            year: 2020,
            count: 435,
            value: 563.4002,
            lowerCi: 495.082125,
            upperCi: 631.718275,
            ageBand: 'All',
            sex: 'Persons',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });
  it.todo(
    'should return APPROPRIATELY for areas which dont have data for the most recent year'
  );
});
