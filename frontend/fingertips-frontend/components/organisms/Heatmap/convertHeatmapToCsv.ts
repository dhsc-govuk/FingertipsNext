import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { HeatmapData } from './heatmap.types';

export const convertHeatmapToCsv = (
  { areas, indicators, dataPoints }: HeatmapData,
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
  const englandArea = areas.find(({ code }) => code === areaCodeForEngland);
  const areasWithoutGroupOrBenchmark = areas.filter(
    ({ code }) =>
      code !== benchmarkAreaCode &&
      code !== groupAreaCode &&
      code !== areaCodeForEngland
  );
  const areasInExportOrder = [...areasWithoutGroupOrBenchmark];
  const areasToAppend = [groupArea, benchmarkArea, englandArea];
  areasToAppend.forEach((appendixArea) => {
    const alreadyIncluded = areasInExportOrder.some(
      (area) => area.code === appendixArea?.code
    );
    if (alreadyIncluded || !appendixArea) return;
    areasInExportOrder.push(appendixArea);
  });

  indicators.forEach((indicator) => {
    const { id, name: indicatorName, latestDataPeriod, unitLabel } = indicator;
    areasInExportOrder.forEach((area) => {
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
