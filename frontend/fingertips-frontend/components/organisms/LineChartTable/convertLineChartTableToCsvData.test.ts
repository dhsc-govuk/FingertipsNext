import { convertLineChartTableToCsvData } from './convertLineChartTableToCsvData';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import {
  Frequency,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

describe('convertLineChartTableToCsvData', () => {
  const baseHealthData = [
    {
      areaCode: 'A1',
      areaName: 'Area One',
      healthData: [
        {
          benchmarkComparison: {
            outcome: 'Better',
            benchmarkAreaCode: 'B1',
          },
          count: 100,
          value: 10.2,
          lowerCi: 9.5,
          upperCi: 11.0,
          trend: 'Increasing',
          datePeriod: mockDatePeriod(2022),
        },
      ],
    },
  ] as unknown as HealthDataForArea[];

  const groupAreaData = {
    areaCode: 'G1',
    areaName: 'Group Area',
    healthData: [
      {
        benchmarkComparison: {
          outcome: 'Worse',
          benchmarkAreaCode: 'B1',
        },
        count: 80,
        value: 12.3,
        lowerCi: 11.0,
        upperCi: 13.5,
        trend: 'Decreasing',
        datePeriod: mockDatePeriod(2022),
      },
    ],
  } as unknown as HealthDataForArea;

  const benchmarkAreaData: HealthDataForArea = {
    areaCode: 'B1',
    areaName: 'Benchmark Area',
    healthData: [
      {
        count: 200,
        value: 11.1,
        lowerCi: 10.0,
        upperCi: 12.0,
        trend: 'Not yet calculated',
        datePeriod: mockDatePeriod(2022),
      },
    ],
  } as unknown as HealthDataForArea;

  it('should generate correct CSV headers and rows', () => {
    const result = convertLineChartTableToCsvData(
      {
        indicatorID: '1',
        indicatorName: 'Indicator',
        unitLabel: '%',
      } as IndicatorDocument,
      baseHealthData,
      groupAreaData,
      benchmarkAreaData,
      95,
      Frequency.Annually,
      true
    );

    expect(result[0]).toEqual([
      CsvHeader.IndicatorId,
      CsvHeader.IndicatorName,
      CsvHeader.Period,
      CsvHeader.Area,
      CsvHeader.AreaCode,
      CsvHeader.Benchmark,
      CsvHeader.BenchmarkComparison,
      CsvHeader.RecentTrend,
      CsvHeader.Count,
      CsvHeader.ValueUnit,
      CsvHeader.Value,
      'Lower confidence limit 95%',
      'Upper confidence limit 95%',
    ]);

    expect(result[1]).toEqual([
      '1',
      'Indicator',
      '2022',
      'Area One',
      'A1',
      'B1',
      'Better',
      'Increasing',
      100,
      '%',
      10.2,
      9.5,
      11.0,
    ]);

    expect(result[2]).toEqual([
      '1',
      'Indicator',
      '2022',
      'Group: Group Area',
      'G1',
      'B1',
      'Worse',
      'Decreasing',
      80,
      '%',
      12.3,
      11.0,
      13.5,
    ]);

    expect(result[3]).toEqual([
      '1',
      'Indicator',
      '2022',
      'Benchmark Area',
      'B1',
      undefined,
      undefined,
      'Not yet calculated',
      200,
      '%',
      11.1,
      10.0,
      12.0,
    ]);
  });
});
