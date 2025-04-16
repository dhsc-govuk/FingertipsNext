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
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  groupAreaCode?: string
) => {
  return useMemo((): MemoDataPrep => {
    const { areas, indicators, dataPoints } =
      extractSortedAreasIndicatorsAndDataPoints(indicatorData, groupAreaCode);
    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, groupAreaCode),
      rows: generateRows(areas, indicators, dataPoints),
      legendsToShow,
    };
  }, [groupAreaCode, indicatorData]);
};
