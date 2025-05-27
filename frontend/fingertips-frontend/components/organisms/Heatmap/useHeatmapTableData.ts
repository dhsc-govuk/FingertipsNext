import { useMemo } from 'react';
import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeatmapIndicatorData,
} from '@/components/organisms/Heatmap/heatmapUtil';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

interface MemoDataPrep {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
  legendsToShow: ReturnType<typeof getMethodsAndOutcomes>;
  benchmarkAreaName?: string;
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  benchmarkAreaCode: string,
  groupAreaCode?: string
) => {
  return useMemo((): MemoDataPrep => {
    const { areas, indicators, dataPoints, benchmarkAreaName } =
      extractSortedAreasIndicatorsAndDataPoints(
        indicatorData,
        benchmarkAreaCode,
        groupAreaCode
      );
    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, groupAreaCode),
      rows: generateRows(areas, indicators, dataPoints),
      legendsToShow,
      benchmarkAreaName,
    };
  }, [groupAreaCode, indicatorData, benchmarkAreaCode]);
};
