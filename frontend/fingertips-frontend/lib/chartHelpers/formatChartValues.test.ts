import {
  generateSeriesData,
  sortHealthDataByDate,
} from '@/lib/chartHelpers/formatChartValues';

const mockData = [
  {
    areaCode: 'A1425',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: '',
        ageBand: '',
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: '',
        ageBand: '',
      },
    ],
  },
];

describe('sortHealthDataByDate', () => {
  it('should sort the healthcare data values in ascending year', async () => {
    const mockSortedData = [
      {
        areaCode: 'A1425',
        healthData: [
          {
            ageBand: '',
            count: 267,
            lowerCi: 441.69151,
            sex: '',
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
          },
          {
            ageBand: '',
            count: 389,
            lowerCi: 441.69151,
            sex: '',
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
          },
        ],
      },
    ];
    const result = sortHealthDataByDate(mockData);

    expect(result).toEqual(mockSortedData);
  });
});

describe('generateSeriesData', () => {
  it('should generate series data', async () => {
    const result = generateSeriesData(mockData);
    const mockSeriesData = [
      {
        data: [
          [2006, 278.29134],
          [2004, 703.420759],
        ],
        name: 'A1425',
        type: 'line',
      },
    ];
    expect(result).toEqual(mockSeriesData);
  });
});