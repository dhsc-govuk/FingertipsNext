import { convertBarChartEmbeddedTableToCsv } from './convertBarChartEmbeddedTableToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { BarChartEmbeddedTableRow } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  BenchmarkOutcome,
  DatePeriod,
  Frequency,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

describe('convertBarChartEmbeddedTableToCsv', () => {
  const indicatorMetaData = {
    indicatorID: 'ind-001',
    indicatorName: 'Life Expectancy',
    unitLabel: '$',
  } as IndicatorDocument;
  const mockDatePeriod: DatePeriod = {
    type: 'Calendar',
    from: new Date('2023-01-01'),
    to: new Date('2023-12-31'),
  };

  const mockPeriod = mockDatePeriod.from.getFullYear().toString();

  const tableRows: BarChartEmbeddedTableRow[] = [
    {
      area: 'London',
      areaCode: 'L1',
      datePeriod: mockDatePeriod,
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

    {
      area: 'Area 1',
      areaCode: 'A1',
      datePeriod: mockDatePeriod,
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
        datePeriod: mockDatePeriod,
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
        datePeriod: mockDatePeriod,
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
    let csv: CsvData;
    beforeEach(() => {
      csv = convertBarChartEmbeddedTableToCsv(
        tableRows,
        Frequency.Annually,
        true,
        mockDatePeriod,
        indicatorMetaData,
        benchmarkData,
        groupData,
        95
      );
    });

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
        CsvHeader.LowerCI.replace('X', '95'),
        CsvHeader.UpperCI.replace('X', '95'),
      ]);
    });

    it('returns correct area row', () => {
      expect(csv[1]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockPeriod,
        tableRows[1].area,
        tableRows[1].areaCode,
        tableRows[1]?.benchmarkComparison?.benchmarkAreaCode,
        tableRows[1]?.benchmarkComparison?.outcome,
        tableRows[1]?.trend,
        tableRows[1]?.count,
        indicatorMetaData.unitLabel,
        tableRows[1]?.value,
        tableRows[1]?.lowerCi,
        tableRows[1]?.upperCi,
      ]);
    });

    it('returns correct group row', () => {
      expect(csv[3]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockPeriod,
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

    it('returns correct benchmark row', () => {
      expect(csv[4]).toEqual([
        indicatorMetaData.indicatorID,
        indicatorMetaData.indicatorName,
        mockPeriod,
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
  });

  it('returns CSV with only main table rows alphabetically when no benchmark or group data is provided', () => {
    const csv = convertBarChartEmbeddedTableToCsv(
      tableRows,
      Frequency.Annually,
      true,
      mockDatePeriod,
      indicatorMetaData
    );

    expect(csv).toHaveLength(3); // header + 1 row
    expect(csv[1]).toEqual([
      indicatorMetaData.indicatorID,
      indicatorMetaData.indicatorName,
      mockPeriod,
      tableRows[1].area,
      tableRows[1].areaCode,
      tableRows[1]?.benchmarkComparison?.benchmarkAreaCode,
      tableRows[1]?.benchmarkComparison?.outcome,
      tableRows[1]?.trend,
      tableRows[1]?.count,
      indicatorMetaData.unitLabel,
      tableRows[1]?.value,
      tableRows[1]?.lowerCi,
      tableRows[1]?.upperCi,
    ]);

    expect(csv[2]).toEqual([
      indicatorMetaData.indicatorID,
      indicatorMetaData.indicatorName,
      mockPeriod,
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

  it('excludes benchmark row if period does not match', () => {
    const modifiedBenchmarkData = {
      ...benchmarkData,
      healthData: [
        {
          ...benchmarkData.healthData[0],
        },
      ],
    };

    const csv = convertBarChartEmbeddedTableToCsv(
      tableRows,
      Frequency.Annually,
      true,
      mockDatePeriod,
      indicatorMetaData,
      modifiedBenchmarkData,
      groupData
    );

    expect(csv).toHaveLength(5);
    expect(csv[2][3]).toBe(tableRows[0].area);
    expect(csv[3][3]).toBe(`Group: ${groupData.areaName}`);
  });

  it('excludes group row if year does not match', () => {
    const modifiedGroupData = {
      ...groupData,
      healthData: [
        {
          ...groupData.healthData[0],
          year: 2020, // no match for 2023
        },
      ],
    };

    const csv = convertBarChartEmbeddedTableToCsv(
      tableRows,
      Frequency.Annually,
      true,
      mockDatePeriod,
      indicatorMetaData,
      benchmarkData,
      modifiedGroupData
    );

    expect(csv).toHaveLength(5);
    expect(csv[2][3]).toBe(tableRows[0].area);
    expect(csv[4][3]).toBe(benchmarkData.areaName);
  });

  it('returns only header row when tableRows is empty and no benchmark/group match', () => {
    const csv = convertBarChartEmbeddedTableToCsv(
      [],
      Frequency.Annually,
      true,
      mockDatePeriod,
      indicatorMetaData
    );
    expect(csv).toHaveLength(1);
  });

  it('omits period if not supplied', () => {
    const csv = convertBarChartEmbeddedTableToCsv(
      tableRows,
      Frequency.Annually,
      true,
      undefined,
      indicatorMetaData,
      benchmarkData,
      groupData,
      95
    );

    expect(csv).toHaveLength(3);
    expect(csv[2][2]).toBe('X'); // 'X' indicates no period provided
  });
});
