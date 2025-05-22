import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { CsvHeader } from '@/components/molecules/Export/export.types';

export const convertLineChartTableToCsvData = (
  healthIndicatorData: HealthDataForArea[],
  groupAreaData?: HealthDataForArea,
  benchmarkAreaData?: HealthDataForArea,
  measurementUnit = '',
  confidenceLimit = 0
): CsvData => {
  const indicatorId = '1';
  const indicatorName = 'Indicator';
  const csvHeaders: CsvRow = [
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

  const csvData: CsvData = [csvHeaders];
  const allAreaData = [
    ...healthIndicatorData,
    groupAreaData,
    benchmarkAreaData,
  ];
  allAreaData.forEach((area) => {
    if (!area) return;
    const { areaName, areaCode } = area;
    const benchmarkPrefix =
      area.areaCode === groupAreaData?.areaCode ? 'Group: ' : '';

    area.healthData.forEach((healthPoint) => {
      const {
        year,
        benchmarkComparison,
        count,
        value,
        lowerCi,
        upperCi,
        trend,
      } = healthPoint;
      const { outcome, benchmarkAreaCode } = benchmarkComparison ?? {};
      csvData.push([
        indicatorId,
        indicatorName,
        year,
        `${benchmarkPrefix}${areaName}`,
        areaCode,
        benchmarkAreaCode,
        outcome,
        trend,
        count,
        measurementUnit,
        value,
        lowerCi,
        upperCi,
      ]);
    });
  });

  return csvData;
};
