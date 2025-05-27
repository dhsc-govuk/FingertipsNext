import { SpineChartIndicatorData } from '@/components/organisms/SpineChartTable/spineChartTableHelpers';
import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { orderStatistics } from '@/components/organisms/SpineChart/SpineChartHelpers';

export const convertSpineChartTableToCsv = (
  indicatorData: SpineChartIndicatorData[]
) => {
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
    CsvHeader.WorstLowest,
    CsvHeader.BestHighest,
  ];

  const csvData: CsvData = [headers];

  indicatorData.forEach((indicator) => {
    const {
      indicatorId,
      indicatorName,
      latestDataPeriod,
      areasHealthData,
      valueUnit,
      quartileData,
      groupData,
    } = indicator;

    const { best, worst } = orderStatistics(quartileData);
    const { benchmarkAreaCode, benchmarkAreaName, benchmarkValue } =
      areasHealthData[0]?.healthData[0]?.benchmarkComparison ?? {};

    areasHealthData.forEach((areasHealth) => {
      if (!areasHealth) return;
      const { areaCode, areaName, healthData } = areasHealth;
      if (!healthData[0]) return;

      const { benchmarkComparison, trend, count, value } = healthData[0];
      const newRow: CsvRow = [
        indicatorId,
        indicatorName,
        latestDataPeriod,
        areaName,
        areaCode,
        benchmarkAreaCode,
        benchmarkComparison?.outcome,
        trend,
        count,
        valueUnit,
        value,
        worst,
        best,
      ];
      csvData.push(newRow);
    });

    if (groupData && groupData?.areaCode !== benchmarkAreaCode) {
      const { areaCode, areaName, healthData } = groupData;
      const { benchmarkComparison, trend, count, value } = healthData[0];
      const groupRow: CsvRow = [
        indicatorId,
        indicatorName,
        latestDataPeriod,
        `Group: ${areaName}`,
        areaCode,
        benchmarkComparison?.benchmarkAreaCode,
        benchmarkComparison?.outcome,
        trend,
        count,
        valueUnit,
        value,
        worst,
        best,
      ];

      csvData.push(groupRow);
    }

    const benchmarkRow: CsvRow = [
      indicatorId,
      indicatorName,
      latestDataPeriod,
      benchmarkAreaName,
      benchmarkAreaCode,
      undefined, // benchmark area code
      undefined, // benchmark outcome
      undefined, // trend
      undefined, // count
      valueUnit,
      benchmarkValue,
      worst,
      best,
    ];
    csvData.push(benchmarkRow);
  });

  return csvData;
};
