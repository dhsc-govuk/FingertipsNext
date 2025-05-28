import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const convertBarChartEmbeddedTableToCsv = (
  period: number,
  tableRows: BarChartEmbeddedTableRow[],
  indicatorMetaData?: IndicatorDocument,
  benchmarkData?: HealthDataForArea,
  groupData?: HealthDataForArea
): CsvData => {
  const { indicatorID, indicatorName, unitLabel } = indicatorMetaData ?? {};

  const benchmarkDataPoint = benchmarkData?.healthData.find(
    ({ year }) => year === period
  );
  const groupDataPoint = groupData?.healthData.find(
    ({ year }) => year === period
  );

  const extendedTableRows = [...tableRows];

  if (groupData && groupDataPoint) {
    const { areaName, areaCode } = groupData;
    extendedTableRows.unshift({
      area: `Group: ${areaName}`,
      areaCode,
      ...groupDataPoint,
    });
  }

  if (benchmarkData && benchmarkDataPoint) {
    const { areaName, areaCode } = benchmarkData;
    extendedTableRows.unshift({
      area: areaName,
      areaCode,
      ...benchmarkDataPoint,
    });
  }

  const headers = [
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
  ];

  const csvData: CsvData = [headers];

  extendedTableRows.forEach((row) => {
    const {
      area,
      areaCode,
      benchmarkComparison,
      trend,
      count,
      value,
      lowerCi,
      upperCi,
    } = row;

    csvData.push([
      indicatorID,
      indicatorName,
      period,
      area,
      areaCode,
      benchmarkComparison?.benchmarkAreaCode,
      benchmarkComparison?.outcome,
      trend,
      count,
      unitLabel,
      value,
      lowerCi,
      upperCi,
    ]);
  });

  return csvData;
};
