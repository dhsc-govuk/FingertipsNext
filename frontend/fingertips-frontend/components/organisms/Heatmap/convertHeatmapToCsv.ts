import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { extractSortedAreasIndicatorsAndDataPoints } from '@/components/organisms/Heatmap/heatmapUtil';
import { CsvHeader } from '@/components/molecules/Export/export.types';

export const convertHeatmapToCsv = (
  {
    areas,
    indicators,
    dataPoints,
  }: ReturnType<typeof extractSortedAreasIndicatorsAndDataPoints>,
  groupAreaCode?: string,
  benchmarkAreaCode?: string
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

  const benchmarkArea = areas.find(({ code }) => code === benchmarkAreaCode);
  const groupArea = areas.find(({ code }) => code === groupAreaCode);
  const areasWithoutGroupOrBenchmark = areas.filter(
    ({ code }) => code !== benchmarkAreaCode && code !== groupAreaCode
  );
  const areasInExportOrder = [
    ...areasWithoutGroupOrBenchmark,
    groupArea,
    benchmarkArea,
  ];

  indicators.forEach((indicator) => {
    const { id, name: indicatorName, latestDataPeriod, unitLabel } = indicator;
    areasInExportOrder.forEach((area) => {
      if (!area) return;
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
