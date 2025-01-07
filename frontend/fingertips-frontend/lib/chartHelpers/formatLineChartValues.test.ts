import {
  generateSeriesData,
  orderedValues,
} from '@/lib/chartHelpers/formatLineChartValues';
import { mockHealthData } from '@/mock/data/healthdata';

describe('orderedValues', () => {
  it('should order the healthcare data values in ascending year', async () => {
    const data = [
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

    const orderedData = [
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
    const result = orderedValues(data);

    expect(result).toEqual(orderedData);
  });
});

describe('generateSeriesData', () => {
  it('should generate series data', async () => {
    const result = generateSeriesData(mockHealthData);
    const expected = [
      {
        data: [890.305692, 703.420759, 602.820845, 278.29134, 971.435418],
        name: 'AreaCode A1425',
        type: 'line',
      },
      {
        data: [723.090354, 905.145997, 135.149304, 890.328253, 478.996862],
        name: 'AreaCode A1426',
        type: 'line',
      },
      {
        data: [579.848756, 383.964067, 851.163104, 775.129883, 290.465304],
        name: 'AreaCode A1427',
        type: 'line',
      },
      {
        data: [400.848756, 320.964067, 600.163104, 650.129883, 500.650389],
        name: 'AreaCode A1428',
        type: 'line',
      },
      {
        data: [472.650389, 472.7613425, 582.306765, 563.4002, 627.899536],
        name: 'AreaCode A1429',
        type: 'line',
      },
    ];
    expect(result).toEqual(expected);
  });
});
