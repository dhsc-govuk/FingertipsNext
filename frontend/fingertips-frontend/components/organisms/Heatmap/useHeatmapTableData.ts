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
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

interface MemoDataPrep {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
  legendsToShow: ReturnType<typeof getMethodsAndOutcomes>;
  csvData: CsvData;
}

export const useHeatmapTableData = (
  indicatorData: HeatmapIndicatorData[],
  benchmarkRefType: BenchmarkReferenceType,
  groupAreaCode: string
) => {
  return useMemo((): MemoDataPrep => {
    const sortedData = extractSortedAreasIndicatorsAndDataPoints(
      indicatorData,
      groupAreaCode,
      benchmarkRefType
    );
    const { areas, indicators, dataPoints, benchmarkAreaName } = sortedData;
    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, groupAreaCode, benchmarkRefType),
      rows: generateRows(
        areas,
        indicators,
        dataPoints,
        benchmarkRefType,
        benchmarkAreaName
      ),
      legendsToShow,
      csvData: convertHeatmapToCsv(sortedData, groupAreaCode),
    };
  }, [indicatorData, benchmarkRefType, groupAreaCode]);
};
