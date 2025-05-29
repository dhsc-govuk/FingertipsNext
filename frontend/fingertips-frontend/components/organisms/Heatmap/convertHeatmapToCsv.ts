import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { extractSortedAreasIndicatorsAndDataPoints } from '@/components/organisms/Heatmap/heatmapUtil';
import { CsvHeader } from '@/components/molecules/Export/export.types';

export const convertHeatmapToCsv = (
  {
    areas,
    indicators,
    dataPoints,
  }: ReturnType<typeof extractSortedAreasIndicatorsAndDataPoints>,
  groupAreaCode?: string
): CsvData => {
  const headers = [
    CsvHeader.IndicatorId,
    CsvHeader.IndicatorName,
    CsvHeader.Period,
    CsvHeader.Area,
    CsvHeader.AreaCode,
    CsvHeader.Benchmark,
    CsvHeader.BenchmarkComparison,
    CsvHeader.ValueUnit,
    CsvHeader.Value,
  ];

  const csvData: CsvData = [headers];

  indicators.forEach((indicator) => {
    const { id, name: indicatorName, latestDataPeriod, unitLabel } = indicator;
    areas.forEach((area) => {
      const { name: areaName, code: areaCode } = area;
      const dataPointsForArea = dataPoints[id] ?? {};
      const { benchmark, value } = dataPointsForArea[areaCode] ?? {};
      const { benchmarkAreaCode, outcome } = benchmark ?? {};
      const row = [
        id,
        indicatorName,
        latestDataPeriod,
        areaCode === groupAreaCode ? `Group: ${areaName}` : areaName,
        areaCode,
        benchmarkAreaCode,
        outcome === 'Baseline' ? undefined : outcome,
        unitLabel,
        value,
      ];
      csvData.push(row);
    });
  });

  return csvData;
};
