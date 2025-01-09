import {
  generateSeriesData,
  orderedValues,
} from '@/lib/chartHelpers/formatLineChartValues';

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
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
      },
    ],
  },
];

describe('orderedValues', () => {
  it('should order the healthcare data values in ascending year', async () => {
    const mockOrderedData = [
      {
        areaCode: 'A1425',
        healthData: [
          {
            count: 267,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 703.420759,
            year: 2004,
          },
          {
            count: 389,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            value: 278.29134,
            year: 2006,
          },
        ],
      },
    ];
    const result = orderedValues(mockData);

    expect(result).toEqual(mockOrderedData);
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
        name: 'AreaCode A1425',
        type: 'line',
      },
    ];
    expect(result).toEqual(mockSeriesData);
  });
});
