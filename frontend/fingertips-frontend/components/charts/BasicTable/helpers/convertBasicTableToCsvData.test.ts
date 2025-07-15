import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { convertBasicTableToCsvData } from './convertBasicTableToCsvData';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';

describe('convertBasicTableToCsvData', () => {
  const basicTableData: BasicTableData[] = [
    {
      indicatorId: 1,
      indicatorName: 'testIndicator1',
      period: '2020',
      count: 200,
      value: 350,
      trend: HealthDataPointTrendEnum.Increasing,
      unitLabel: '%',
      areaCode: areaCodeForEngland,
      areaName: englandAreaString,
    },
    {
      indicatorId: 2,
      indicatorName: 'testIndicator2',
      period: '2022',
      count: 100,
      value: 500,
      trend: HealthDataPointTrendEnum.Decreasing,
      unitLabel: 'per 100,000',
      areaCode: areaCodeForEngland,
      areaName: englandAreaString,
    },
    {
      indicatorId: 3,
      indicatorName: 'testIndicator3',
      period: '2025',
      count: 100,
      value: 500,
      unitLabel: '%',
      areaCode: areaCodeForEngland,
      areaName: englandAreaString,
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
