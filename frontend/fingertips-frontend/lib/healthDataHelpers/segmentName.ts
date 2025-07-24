import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';
import { SegmentationId } from '@/lib/common-types';

export const segmentName = (segment: IndicatorSegment) => {
  const info = {
    [SegmentationId.Sex]: segment.sex.value,
    [SegmentationId.Age]: '', // segment.age.value,
    [SegmentationId.Frequency]: '', // segment.frequency.value,
  };

  return segmentNameFromInfo(info);
};
