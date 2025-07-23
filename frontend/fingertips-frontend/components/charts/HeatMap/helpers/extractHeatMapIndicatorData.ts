import {
  BenchmarkComparisonMethod,
  Frequency,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';
import { SegmentationId } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';

export function extractHeatmapIndicatorData(
  indicatorData: IndicatorWithHealthDataForArea,
  metadata: IndicatorDocument,
  segmentInfo: Record<SegmentationId, string>
): HeatmapIndicatorData | undefined {
  if (!indicatorData.areaHealthData) {
    return undefined;
  }

  const segmentId = Object.entries(segmentInfo).map(
    ([key, value]) => `${key}:${value}`
  );

  const segmentName = segmentNameFromInfo(segmentInfo);

  return {
    rowId: `${metadata.indicatorID}-${segmentId}`,
    indicatorId: metadata.indicatorID,
    indicatorName: `${metadata.indicatorName} (${segmentName})`,
    healthDataForAreas: indicatorData.areaHealthData,
    unitLabel: metadata.unitLabel,
    benchmarkComparisonMethod:
      indicatorData.benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
    polarity: indicatorData.polarity ?? IndicatorPolarity.Unknown,
    segmentInfo,
    frequency: indicatorData.frequency ?? Frequency.Annually,
  };
}
