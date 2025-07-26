import { SpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';
import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { orderStatistics } from '@/components/charts/SpineChart/helpers/orderStatistics';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { Frequency } from '@/generated-sources/ft-api-client';

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
      englandData,
    } = indicator;

    const { best, worst } = orderStatistics(quartileData);
    const period = latestDataPeriod
      ? formatDatePointLabel(
          latestDataPeriod,
          quartileData.frequency ?? Frequency.Annually,
          1
        )
      : '';

    areasHealthData.forEach((areasHealth) => {
      if (!areasHealth) return;
      const { areaCode, areaName, healthData } = areasHealth;
      if (!healthData[0]) return;

      const { benchmarkComparison, trend, count, value } = healthData[0];
      const newRow: CsvRow = [
        indicatorId,
        indicatorName,
        period,
        areaName,
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
      csvData.push(newRow);
    });

    if (groupData) {
      const { areaCode, areaName, healthData } = groupData;
      if (!healthData[0]) return;

      const { benchmarkComparison, trend, count, value } = healthData[0];

      const groupRow: CsvRow = [
        indicatorId,
        indicatorName,
        period,
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

    if (englandData && englandData.areaCode !== groupData?.areaCode) {
      const { areaCode, areaName, healthData } = englandData;
      if (!healthData[0]) return;

      const { benchmarkComparison, trend, count, value } = healthData[0];

      const newRow: CsvRow = [
        indicatorId,
        indicatorName,
        period,
        areaName,
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
      csvData.push(newRow);
    }
  });

  return csvData;
};
