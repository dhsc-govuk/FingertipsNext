import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const convertLineChartTableToCsvData = (
  indicatorMetadata: IndicatorDocument,
  healthIndicatorData: HealthDataForArea[],
  groupAreaData?: HealthDataForArea,
  benchmarkAreaData?: HealthDataForArea,
  confidenceLimit = 0
): CsvData => {
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
        indicatorMetadata.indicatorID,
        indicatorMetadata.indicatorName,
        year,
        `${benchmarkPrefix}${areaName}`,
        areaCode,
        benchmarkAreaCode,
        outcome,
        trend,
        count,
        indicatorMetadata?.unitLabel,
        value,
        lowerCi,
        upperCi,
      ]);
    });
  });

  return csvData;
};
