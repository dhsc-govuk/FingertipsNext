import { useMemo } from 'react';
import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeatmapIndicatorData,
} from '@/components/organisms/Heatmap/heatmapUtil';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { convertHeatmapToCsv } from '@/components/organisms/Heatmap/convertHeatmapToCsv';

interface MemoDataPrep {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
  legendsToShow: ReturnType<typeof getMethodsAndOutcomes>;
  csvData: CsvData;
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  groupAreaCode: string,
  benchmarkAreaCode: string
) => {
  return useMemo((): MemoDataPrep => {
    const sortedData = extractSortedAreasIndicatorsAndDataPoints(
      indicatorData,
      groupAreaCode,
      benchmarkAreaCode
    );
    const { areas, indicators, dataPoints, benchmarkAreaName } = sortedData;
    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, groupAreaCode, benchmarkAreaCode),
      rows: generateRows(
        areas,
        indicators,
        dataPoints,
        groupAreaCode,
        benchmarkAreaCode,
        benchmarkAreaName
      ),
      legendsToShow,
      csvData: convertHeatmapToCsv(sortedData, groupAreaCode),
    };
  }, [indicatorData, groupAreaCode, benchmarkAreaCode]);
};
