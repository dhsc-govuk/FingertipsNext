import { useMemo } from 'react';
import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeatmapIndicatorData,
} from '@/components/organisms/Heatmap/heatmapUtil';

interface MemoDataPrep {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  groupAreaCode?: string
) => {
  return useMemo((): MemoDataPrep => {
    const { areas, indicators, dataPoints } =
      extractSortedAreasIndicatorsAndDataPoints(indicatorData, groupAreaCode);
    return {
      headers: generateHeaders(areas, groupAreaCode),
      rows: generateRows(areas, indicators, dataPoints),
    };
  }, [groupAreaCode, indicatorData]);
};
