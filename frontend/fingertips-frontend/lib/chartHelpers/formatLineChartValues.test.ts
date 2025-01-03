import {
  formatYearsForXAxis,
  generateSeriesData,
} from '@/lib/chartHelpers/formatLineChartValues';
import { mockHealthData } from '@/mock/data/healthdata';

describe('formatYearsForAxis', () => {
  it('should format strings and sort them in ascending order', async () => {
    const result = formatYearsForXAxis(mockHealthData);
    const expected = [
      '2004',
      '2005',
      '2006',
      '2007',
      '2008',
      '2010',
      '2012',
      '2017',
      '2018',
      '2020',
      '2022',
      '2023',
      '2024',
    ];
    expect(result).toEqual(expected);
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
