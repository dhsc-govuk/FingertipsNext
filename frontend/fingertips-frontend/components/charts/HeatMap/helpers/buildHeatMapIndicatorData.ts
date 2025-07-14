import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';
import { extractHeatmapIndicatorData } from '@/components/charts/HeatMap';

export const buildHeatmapIndicatorData = (
  allIndicatorData: IndicatorWithHealthDataForArea[],
  indicatorMetadata: IndicatorDocument[]
): HeatmapIndicatorData[] => {
  return allIndicatorData
    .map((indicatorData) => {
      const metadata = indicatorMetadata.find((metadata) => {
        return metadata.indicatorID === indicatorData.indicatorId?.toString();
      });

      if (!metadata) return undefined;

      return extractHeatmapIndicatorData(indicatorData, metadata);
    })
    .filter((data) => {
      return data !== undefined;
    });
};
