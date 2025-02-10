import {
  getEnglandDataForIndicatorIndex,
  seriesDataWithoutEngland,
  shouldDisplayLineChart,
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

describe('seriesDataWithoutEngland', () => {
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

    const result = seriesDataWithoutEngland(data);
    expect(result).toEqual(dataWithoutEngland);
  });
});

describe('should display line chart', () => {
  describe('should return false', () => {
    it('should return false when more than 1 indicator is selected', () => {
      expect(shouldDisplayLineChart([mockData], ['1', '2'])).toBe(false);
    });

    it('should return false when more than 2 area codes are selected for an indicator', () => {
      const data = [
        ...mockData,
        {
          ...mockData[0],
          areaCode: 'A2',
          areaName: 'Area 2',
        },
        {
          ...mockData[0],
          areaCode: 'A3',
          areaName: 'Area 3',
        },
      ];
      expect(shouldDisplayLineChart([data], ['1'])).toBe(false);
    });

    it('should return false when health data contains less than 2 time periods', () => {
      const data = [
        {
          areaCode: 'A2',
          areaName: 'Area 2',
          healthData: [mockData[0].healthData[0]],
        },
      ];
      expect(shouldDisplayLineChart([data], ['1'])).toBe(false);
    });
  });
});
