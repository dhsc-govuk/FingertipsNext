import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { SegmentationId } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';

export const segmentName = (segment: IndicatorSegment) => {
  const info = {
    [SegmentationId.Sex]: segment.sex.value,
    [SegmentationId.Age]: '', // segment.age.value,
    [SegmentationId.Frequency]: '', // segment.frequency.value,
  };

  return segmentNameFromInfo(info);
};
