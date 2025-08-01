import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { BarChartEmbeddedTableRow } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  DatePeriod,
  Frequency,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export const convertBarChartEmbeddedTableToCsv = (
  tableRows: BarChartEmbeddedTableRow[],
  frequency: Frequency,
  isSmallestReportingPeriod: boolean,
  period?: DatePeriod,
  indicatorMetaData?: IndicatorDocument,
  benchmarkData?: HealthDataForArea,
  groupData?: HealthDataForArea,
  confidenceLimit?: number
): CsvData => {
  const { indicatorID, indicatorName, unitLabel } = indicatorMetaData ?? {};

  const benchmarkDataPoint = benchmarkData?.healthData.find(
    ({ datePeriod }) => datePeriod === period
  );
  const groupDataPoint = groupData?.healthData.find(
    ({ datePeriod }) => datePeriod === period
  );

  const sortedTableRows = tableRows.toSorted((a, b) => {
    return a.area.localeCompare(b.area);
  });

  const extendedTableRows = [...sortedTableRows];

  if (groupData && groupDataPoint) {
    const { areaName, areaCode } = groupData;
    extendedTableRows.push({
      area: `Group: ${areaName}`,
      areaCode,
      ...groupDataPoint,
    });
  }

  if (benchmarkData && benchmarkDataPoint) {
    const { areaName, areaCode } = benchmarkData;
    extendedTableRows.push({
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
    CsvHeader.LowerCI.replace('X', String(confidenceLimit)),
    CsvHeader.UpperCI.replace('X', String(confidenceLimit)),
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
      formatDatePointLabel(period, frequency, isSmallestReportingPeriod),
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
