import {
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { BasicTableData } from '.';
import { convertBasicTableToCsvData } from './convertBasicTableToCsvData';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

describe('convertBasicTableToCsvData', () => {
  const basicTableData: BasicTableData[] = [
    {
      indicatorId: 1,
      indicatorName: 'testIndicator1',
      period: '2020',
      latestEnglandHealthData: {
        count: 200,
        value: 350,
        trend: HealthDataPointTrendEnum.Increasing,
      } as unknown as HealthDataPoint,
      unitLabel: '%',
    },
    {
      indicatorId: 2,
      indicatorName: 'testIndicator2',
      period: '2022',
      latestEnglandHealthData: {
        count: 100,
        value: 500,
        trend: HealthDataPointTrendEnum.Decreasing,
      } as unknown as HealthDataPoint,
      unitLabel: 'per 100,000',
    },
    {
      indicatorId: 3,
      indicatorName: 'testIndicator3',
      period: '2025',
      latestEnglandHealthData: {
        count: 100,
        value: 500,
      } as unknown as HealthDataPoint,
      unitLabel: '%',
    },
  ];

  it('should convert basic table data to csv', () => {
    const result = convertBasicTableToCsvData(basicTableData);

    expect(result[0]).toEqual([
      CsvHeader.IndicatorId,
      CsvHeader.IndicatorName,
      CsvHeader.Period,
      CsvHeader.Area,
      CsvHeader.AreaCode,
      CsvHeader.RecentTrend,
      CsvHeader.Count,
      CsvHeader.ValueUnit,
      CsvHeader.Value,
    ]);

    expect(result[1]).toEqual([
      1,
      'testIndicator1',
      '2020',
      'England',
      areaCodeForEngland,
      HealthDataPointTrendEnum.Increasing,
      200,
      '%',
      350,
    ]);

    expect(result[2]).toEqual([
      2,
      'testIndicator2',
      '2022',
      'England',
      areaCodeForEngland,
      HealthDataPointTrendEnum.Decreasing,
      100,
      'per 100,000',
      500,
    ]);

    expect(result[3]).toEqual([
      3,
      'testIndicator3',
      '2025',
      'England',
      areaCodeForEngland,
      HealthDataPointTrendEnum.CannotBeCalculated,
      100,
      '%',
      500,
    ]);
  });
});
