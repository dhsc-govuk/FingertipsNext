import {
  mockSpineGroupData,
  mockSpineHealthDataForArea,
  mockSpineIndicatorData,
  mockSpineQuartileData,
} from '@/components/organisms/SpineChartTable/spineChartMockTestData';
import { convertSpineChartTableToCsv } from '@/components/organisms/SpineChartTable/convertSpineChartTableToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';

describe('convertSpineChartTableToCsv', () => {
  it('should have correct headings', () => {
    expect(convertSpineChartTableToCsv([])).toEqual([
      [
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
        CsvHeader.WorstLowest,
        CsvHeader.BestHighest,
      ],
    ]);
  });

  it('should convert spine area data to csv', () => {
    const result = convertSpineChartTableToCsv([mockSpineIndicatorData]);
    expect(result).toHaveLength(4);

    const row = result[1];
    const healthPoint = mockSpineHealthDataForArea.healthData[0];
    const areaBenchmark = healthPoint.benchmarkComparison;

    expect(row[0]).toEqual(mockSpineIndicatorData.indicatorId);
    expect(row[1]).toEqual(mockSpineIndicatorData.indicatorName);
    expect(row[2]).toEqual(mockSpineIndicatorData.latestDataPeriod);
    expect(row[3]).toEqual(mockSpineHealthDataForArea.areaName);
    expect(row[4]).toEqual(mockSpineHealthDataForArea.areaCode);
    expect(row[5]).toEqual(areaBenchmark?.benchmarkAreaCode);
    expect(row[6]).toEqual(areaBenchmark?.outcome);
    expect(row[7]).toEqual(healthPoint.trend);
    expect(row[8]).toEqual(healthPoint.count);
    expect(row[9]).toEqual(mockSpineIndicatorData.valueUnit);
    expect(row[10]).toEqual(healthPoint.value);
    expect(row[11]).toEqual(mockSpineQuartileData.q0Value);
    expect(row[12]).toEqual(mockSpineQuartileData.q4Value);
  });

  it('should convert spine group data to csv', () => {
    const result = convertSpineChartTableToCsv([mockSpineIndicatorData]);
    expect(result).toHaveLength(4);

    const row = result[2];
    const groupHealthPoint = mockSpineGroupData.healthData[0];
    const groupBenchmark = groupHealthPoint.benchmarkComparison;

    expect(row[0]).toEqual(mockSpineIndicatorData.indicatorId);
    expect(row[1]).toEqual(mockSpineIndicatorData.indicatorName);
    expect(row[2]).toEqual(mockSpineIndicatorData.latestDataPeriod);
    expect(row[3]).toEqual(`Group: ${mockSpineGroupData.areaName}`);
    expect(row[4]).toEqual(mockSpineGroupData.areaCode);
    expect(row[5]).toEqual(groupBenchmark?.benchmarkAreaCode);
    expect(row[6]).toEqual(groupBenchmark?.outcome);
    expect(row[7]).toEqual(groupHealthPoint.trend);
    expect(row[8]).toEqual(groupHealthPoint.count);
    expect(row[9]).toEqual(mockSpineIndicatorData.valueUnit);
    expect(row[10]).toEqual(groupHealthPoint.value);
    expect(row[11]).toEqual(mockSpineQuartileData.q0Value);
    expect(row[12]).toEqual(mockSpineQuartileData.q4Value);
  });

  it('should convert spine benchmark data to csv', () => {
    const result = convertSpineChartTableToCsv([mockSpineIndicatorData]);
    expect(result).toHaveLength(4);

    const row = result[3];
    const healthPoint = mockSpineHealthDataForArea.healthData[0];
    const areaBenchmark = healthPoint.benchmarkComparison;

    expect(row[0]).toEqual(mockSpineIndicatorData.indicatorId);
    expect(row[1]).toEqual(mockSpineIndicatorData.indicatorName);
    expect(row[2]).toEqual(mockSpineIndicatorData.latestDataPeriod);
    expect(row[3]).toEqual(areaBenchmark?.benchmarkAreaName);
    expect(row[4]).toEqual(areaBenchmark?.benchmarkAreaCode);
    expect(row[5]).toEqual(undefined);
    expect(row[6]).toEqual(undefined);
    expect(row[7]).toEqual(undefined);
    expect(row[8]).toEqual(undefined);
    expect(row[9]).toEqual(mockSpineIndicatorData.valueUnit);
    expect(row[10]).toEqual(areaBenchmark?.benchmarkValue);
    expect(row[11]).toEqual(mockSpineQuartileData.q0Value);
    expect(row[12]).toEqual(mockSpineQuartileData.q4Value);
  });

  it('should convert correctly without group data', () => {
    const result = convertSpineChartTableToCsv([
      { ...mockSpineIndicatorData, groupData: null },
    ]);
    expect(result).toHaveLength(3);

    expect(result[1][4]).toEqual(mockSpineHealthDataForArea.areaCode);

    const row = result[2];
    const healthPoint = mockSpineHealthDataForArea.healthData[0];
    const areaBenchmark = healthPoint.benchmarkComparison;

    expect(row[0]).toEqual(mockSpineIndicatorData.indicatorId);
    expect(row[1]).toEqual(mockSpineIndicatorData.indicatorName);
    expect(row[2]).toEqual(mockSpineIndicatorData.latestDataPeriod);
    expect(row[3]).toEqual(areaBenchmark?.benchmarkAreaName);
    expect(row[4]).toEqual(areaBenchmark?.benchmarkAreaCode);
    expect(row[5]).toEqual(undefined);
    expect(row[6]).toEqual(undefined);
    expect(row[7]).toEqual(undefined);
    expect(row[8]).toEqual(undefined);
    expect(row[9]).toEqual(mockSpineIndicatorData.valueUnit);
    expect(row[10]).toEqual(areaBenchmark?.benchmarkValue);
    expect(row[11]).toEqual(mockSpineQuartileData.q0Value);
    expect(row[12]).toEqual(mockSpineQuartileData.q4Value);
  });

  it('should convert correctly when group data is benchmark group', () => {
    const cloneMockSpineGroupData = JSON.parse(
      JSON.stringify(mockSpineGroupData)
    );
    cloneMockSpineGroupData.areaCode =
      mockSpineHealthDataForArea.healthData[0]?.benchmarkComparison?.benchmarkAreaCode;
    cloneMockSpineGroupData.areaName =
      mockSpineHealthDataForArea.healthData[0]?.benchmarkComparison?.benchmarkAreaName;

    cloneMockSpineGroupData.healthData[0].benchmarkComparison = null;

    const testData = {
      ...mockSpineIndicatorData,
      groupData: cloneMockSpineGroupData,
    };

    const result = convertSpineChartTableToCsv([testData]);
    expect(result).toHaveLength(3);

    expect(result[1][4]).toEqual(mockSpineHealthDataForArea.areaCode);
    const row = result[2];
    const healthPoint = mockSpineHealthDataForArea.healthData[0];
    const areaBenchmark = healthPoint.benchmarkComparison;

    expect(row[0]).toEqual(mockSpineIndicatorData.indicatorId);
    expect(row[1]).toEqual(mockSpineIndicatorData.indicatorName);
    expect(row[2]).toEqual(mockSpineIndicatorData.latestDataPeriod);
    expect(row[3]).toEqual(areaBenchmark?.benchmarkAreaName);
    expect(row[4]).toEqual(areaBenchmark?.benchmarkAreaCode);
    expect(row[5]).toEqual(undefined);
    expect(row[6]).toEqual(undefined);
    expect(row[7]).toEqual(undefined);
    expect(row[8]).toEqual(undefined);
    expect(row[9]).toEqual(mockSpineIndicatorData.valueUnit);
    expect(row[10]).toEqual(areaBenchmark?.benchmarkValue);
    expect(row[11]).toEqual(mockSpineQuartileData.q0Value);
    expect(row[12]).toEqual(mockSpineQuartileData.q4Value);
  });
});
