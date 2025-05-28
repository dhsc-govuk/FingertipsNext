import { convertBarChartEmbeddedTableToCsv } from './convertBarChartEmbeddedTableToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';

describe('convertBarChartEmbeddedTableToCsv', () => {
  const indicatorMetaData = {
    indicatorID: 'ind-001',
    indicatorName: 'Life Expectancy',
    unitLabel: '$',
  } as IndicatorDocument;
  const mockYear = 2023;

  const tableRows: BarChartEmbeddedTableRow[] = [
    {
      area: 'Area 1',
      areaCode: 'A1',
      year: mockYear,
      benchmarkComparison: {
        benchmarkAreaCode: 'B1',
        outcome: BenchmarkOutcome.Better,
      },
      trend: HealthDataPointTrendEnum.IncreasingAndGettingBetter,
      count: 123,
      value: 75.3,
      lowerCi: 74.0,
      upperCi: 76.5,
    } as BarChartEmbeddedTableRow,
  ];

  const benchmarkData: HealthDataForArea = {
    areaName: 'Benchmark Area',
    areaCode: 'B1',
    healthData: [
      {
        year: mockYear,
        benchmarkComparison: {
          benchmarkAreaCode: 'NAT',
          outcome: BenchmarkOutcome.Similar,
        },
        trend: HealthDataPointTrendEnum.NoSignificantChange,
        count: 500,
        value: 78.1,
        lowerCi: 77.0,
        upperCi: 79.2,
      } as HealthDataPoint,
    ],
  };

  const groupData: HealthDataForArea = {
    areaName: 'Group Name',
    areaCode: 'G1',
    healthData: [
      {
        year: mockYear,
        benchmarkComparison: {
          benchmarkAreaCode: 'NAT',
          outcome: BenchmarkOutcome.Better,
        },
        trend: 'Decreasing',
        count: 1000,
        value: 79.5,
        lowerCi: 78.0,
        upperCi: 81.0,
      } as HealthDataPoint,
    ],
  };

  describe('correct CSV data with benchmark and group rows', () => {
    const csv = convertBarChartEmbeddedTableToCsv(
      mockYear,
      tableRows,
      indicatorMetaData,
      benchmarkData,
      groupData
    );
    it('returns correct headers', () => {
      expect(csv[0]).toEqual([
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
        CsvHeader.LowerCI,
        CsvHeader.UpperCI,
      ]);
    });

    it('returns correct benchmark row', () => {
      expect(csv[1]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockYear,
        benchmarkData.areaName,
        benchmarkData.areaCode,
        benchmarkData.healthData[0]?.benchmarkComparison?.benchmarkAreaCode,
        benchmarkData.healthData[0]?.benchmarkComparison?.outcome,
        benchmarkData.healthData[0]?.trend,
        benchmarkData.healthData[0]?.count,
        indicatorMetaData.unitLabel,
        benchmarkData.healthData[0]?.value,
        benchmarkData.healthData[0]?.lowerCi,
        benchmarkData.healthData[0]?.upperCi,
      ]);
    });

    it('returns correct group row', () => {
      expect(csv[2]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockYear,
        `Group: ${groupData.areaName}`,
        groupData.areaCode,
        groupData.healthData[0]?.benchmarkComparison?.benchmarkAreaCode,
        groupData.healthData[0]?.benchmarkComparison?.outcome,
        groupData.healthData[0]?.trend,
        groupData.healthData[0]?.count,
        indicatorMetaData.unitLabel,
        groupData.healthData[0]?.value,
        groupData.healthData[0]?.lowerCi,
        groupData.healthData[0]?.upperCi,
      ]);
    });

    it('returns correct area row', () => {
      expect(csv[3]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockYear,
        tableRows[0].area,
        tableRows[0].areaCode,
        tableRows[0]?.benchmarkComparison?.benchmarkAreaCode,
        tableRows[0]?.benchmarkComparison?.outcome,
        tableRows[0]?.trend,
        tableRows[0]?.count,
        indicatorMetaData.unitLabel,
        tableRows[0]?.value,
        tableRows[0]?.lowerCi,
        tableRows[0]?.upperCi,
      ]);
    });
  });

  it('returns CSV with only main table rows when no benchmark or group data is provided', () => {
    const csv = convertBarChartEmbeddedTableToCsv(
      2023,
      tableRows,
      indicatorMetaData
    );

    expect(csv).toHaveLength(2); // header + 1 row
    expect(csv[1]).toEqual([
      indicatorMetaData.indicatorID,
      indicatorMetaData.indicatorName,
      mockYear,
      tableRows[0].area,
      tableRows[0].areaCode,
      tableRows[0]?.benchmarkComparison?.benchmarkAreaCode,
      tableRows[0]?.benchmarkComparison?.outcome,
      tableRows[0]?.trend,
      tableRows[0]?.count,
      indicatorMetaData.unitLabel,
      tableRows[0]?.value,
      tableRows[0]?.lowerCi,
      tableRows[0]?.upperCi,
    ]);
  });

  it('excludes benchmark row if year does not match', () => {
    const modifiedBenchmarkData = {
      ...benchmarkData,
      healthData: [
        {
          ...benchmarkData.healthData[0],
          year: 2020, // no match for 2023
        },
      ],
    };

    const csv = convertBarChartEmbeddedTableToCsv(
      2023,
      tableRows,
      indicatorMetaData,
      modifiedBenchmarkData,
      groupData
    );

    expect(csv).toHaveLength(3);
    expect(csv[1][3]).toBe(`Group: ${groupData.areaName}`);
    expect(csv[2][3]).toBe(tableRows[0].area);
  });

  it('returns only header row when tableRows is empty and no benchmark/group match', () => {
    const csv = convertBarChartEmbeddedTableToCsv(2023, [], indicatorMetaData);
    expect(csv).toHaveLength(1);
  });
});
