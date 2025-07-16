import { useMemo } from 'react';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { convertHeatmapToCsv } from '@/components/charts/HeatMap/helpers/convertHeatmapToCsv';
import { Header, HeatmapIndicatorData, Row } from '../heatmap.types';
import { extractSortedAreasIndicatorsAndDataPoints } from '../helpers/prepareHeatmapData';
import { generateRows } from '../helpers/generateHeatmapRows';
import { generateHeaders } from '../helpers/generateHeatmapHeaders';

interface MemoDataPrep {
  headers: Header[];
  rows: Row[];
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

    const { areas, indicators, dataPoints } = sortedData;

    const legendsToShow = getMethodsAndOutcomes(indicatorData);
    return {
      headers: generateHeaders(areas, groupAreaCode, benchmarkAreaCode),
      rows: generateRows(
        areas,
        indicators,
        dataPoints,
        groupAreaCode,
        benchmarkAreaCode
      ),
      legendsToShow,
      csvData: convertHeatmapToCsv(
        sortedData,
        groupAreaCode,
        benchmarkAreaCode
      ),
    };
  }, [indicatorData, groupAreaCode, benchmarkAreaCode]);
};
