import { useMemo } from 'react';
import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeatmapIndicatorData,
} from '@/components/organisms/Heatmap/heatmapUtil';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

interface MemoDataPrep {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
  legendsToShow: ReturnType<typeof getMethodsAndOutcomes>;
  benchmarkAreaName?: string;
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  benchmarkRefType: BenchmarkReferenceType,
  groupAreaCode: string
) => {
  return useMemo((): MemoDataPrep => {
    const { areas, indicators, dataPoints, benchmarkAreaName } =
      extractSortedAreasIndicatorsAndDataPoints(
        indicatorData,
        groupAreaCode,
        benchmarkRefType
      );
    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, benchmarkRefType, groupAreaCode),
      rows: generateRows(areas, indicators, dataPoints),
      legendsToShow,
      benchmarkAreaName,
    };
  }, [indicatorData, benchmarkRefType, groupAreaCode]);
};
