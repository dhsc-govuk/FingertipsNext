import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';

export function extractHeatmapIndicatorData(
  indicatorData: IndicatorWithHealthDataForArea,
  metadata: IndicatorDocument
): HeatmapIndicatorData | undefined {
  if (!indicatorData.areaHealthData) {
    return undefined;
  }

  return {
    indicatorId: metadata.indicatorID,
    indicatorName: metadata.indicatorName,
    healthDataForAreas: indicatorData.areaHealthData,
    unitLabel: metadata.unitLabel,
    benchmarkComparisonMethod:
      indicatorData.benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
    polarity: indicatorData.polarity ?? IndicatorPolarity.Unknown,
  };
}
