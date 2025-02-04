import {
  generateSeriesData,
  getEnglandDataForIndicatorIndex,
  sortHealthDataByDate,
  sortHealthDataByYearDescending,
} from '@/lib/chartHelpers/chartHelpers';
import { mockHealthData } from '@/mock/data/healthdata';

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
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
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
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: 'Persons',
            ageBand: 'All',
          },
        ],
      },
    ];
    const result = sortHealthDataByDate(mockData);

    expect(result).toEqual(mockSortedData);
  });
});

describe('generateSeriesData', () => {
  it('should generate series data', () => {
    const result = generateSeriesData(mockData);
    const mockSeriesData = [
      {
        data: [
          [2006, 278.29134],
          [2004, 703.420759],
        ],
        name: 'North FooBar',
        type: 'line',
      },
      {
        color: 'black',
        data: [],
        marker: {
          symbol: 'circle',
        },
        name: 'England',
        type: 'line',
      },
    ];
    expect(result).toEqual(mockSeriesData);
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
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
            sex: 'Persons',
            ageBand: 'All',
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
          },
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
            sex: 'Persons',
            ageBand: 'All',
          },
        ],
      },
    ];

    const result = sortHealthDataByYearDescending(mockData);
    expect(result).toEqual(mockSortedData);
  });
});

describe('getEnglandDataForIndicatorIndex', () => {
  it('should find England data for specified indicator id', () => {
    const data = [mockHealthData['337'], mockHealthData['1']];

    expect(getEnglandDataForIndicatorIndex(data, 0)).toEqual(
      mockHealthData['337'][0]
    );
    expect(getEnglandDataForIndicatorIndex(data, 1)).toEqual(
      mockHealthData['1'][1]
    );
  });
});
