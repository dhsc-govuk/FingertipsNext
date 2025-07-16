import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';
import { extractHeatmapIndicatorData } from '@/components/charts/HeatMap/HeatMap';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { segmentCombinations } from '@/lib/healthDataHelpers/segmentCombinations';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { indicatorsSorted } from '@/lib/healthDataHelpers/indicatorsSorted';

export const buildHeatmapIndicatorData = (
  allIndicatorData: IndicatorWithHealthDataForArea[],
  indicatorMetadata: IndicatorDocument[]
): HeatmapIndicatorData[] => {
  const heatmapIndicatorData: HeatmapIndicatorData[] = [];

  const indicatorsInOrder = indicatorsSorted(allIndicatorData);

  indicatorsInOrder.forEach((indicator) => {
    const metadata = indicatorMetadata.find(
      ({ indicatorID }) => indicatorID === indicator.indicatorId?.toString()
    );

    if (!metadata) return;

    const segValues = segmentValues(indicator);
    const combinations = segmentCombinations(segValues);
    combinations.forEach((combination) => {
      const search: SearchStateParams = {
        [SearchParams.SegmentationSex]: combination.sex,
        [SearchParams.SegmentationAge]: combination.age,
        [SearchParams.SegmentationFrequency]: combination.frequency,
      };
      const extractedSegment = flattenSegment(indicator, search);

      const extractedData = extractHeatmapIndicatorData(
        extractedSegment,
        metadata,
        combination
      );

      if (!extractedData) return;

      heatmapIndicatorData.push(extractedData);
    });
  });

  return heatmapIndicatorData;
};
