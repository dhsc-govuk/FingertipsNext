import {
  BenchmarkComparisonMethod,
  Frequency,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';
import { segmentIdFromInfo } from '@/lib/healthDataHelpers/segmentIdFromInfo';
import { SegmentInfo } from '@/lib/common-types';

export function extractHeatmapIndicatorData(
  indicatorData: IndicatorWithHealthDataForArea,
  metadata: IndicatorDocument,
  segmentInfo: SegmentInfo
): HeatmapIndicatorData | undefined {
  if (!indicatorData.areaHealthData) {
    return undefined;
  }

  const segmentId = segmentIdFromInfo(metadata.indicatorID, segmentInfo);
  const segmentName = segmentNameFromInfo(segmentInfo);

  return {
    rowId: segmentId,
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
