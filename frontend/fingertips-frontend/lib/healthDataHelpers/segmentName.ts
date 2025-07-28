import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';
import { SegmentationId, SegmentInfo } from '@/lib/common-types';

export const segmentName = (segment: IndicatorSegment) => {
  const info: SegmentInfo = {
    [SegmentationId.Sex]: segment.sex?.value ?? '',
    [SegmentationId.Age]: segment.age?.value ?? '',
    [SegmentationId.ReportingPeriod]: '', // segment.frequency.value,
  };

  return segmentNameFromInfo(info);
};
