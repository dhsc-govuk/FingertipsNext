import {
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
  sortHealthDataForAreasByDate,
  sortHealthDataByYearDescending,
  isEnglandSoleSelectedArea,
  sortHealthDataPointsByDescendingYear,
  getHealthDataWithoutInequalities,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';
import { areaCodeForEngland } from './constants';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { noDeprivation } from '../mocks';

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
        sex: 'Persons',
        ageBand: 'All',
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
        sex: 'Persons',
        ageBand: 'All',
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
        sex: 'Male',
        ageBand: 'All',
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
            sex: 'Persons',
            ageBand: 'All',
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
            sex: 'Male',
            ageBand: 'All',
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
            sex: 'Persons',
            ageBand: 'All',
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
        deprivation: noDeprivation,
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
        deprivation: noDeprivation,
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
        deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            sex: 'Persons',
            ageBand: 'All',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
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
            deprivation: noDeprivation,
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

describe('getHealthDataWithoutInequalities', () => {
  it('should return health data without inequalities', () => {
    expect(getHealthDataWithoutInequalities(mockData[0])).toEqual(
      mockData[0].healthData.slice(0, 2)
    );
  });
});
