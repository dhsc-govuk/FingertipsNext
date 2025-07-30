import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { segmentNameFromInfo } from '@/lib/healthDataHelpers/segmentNameFromInfo';
import { SegmentationId, SegmentInfo } from '@/lib/common-types';
import { reportingPeriodLabelOrder } from './segmentValues';

export const segmentName = (segment: IndicatorSegment) => {
  const info: SegmentInfo = {
    [SegmentationId.Sex]: segment.sex?.value ?? '',
    [SegmentationId.Age]: segment.age?.value ?? '',
    [SegmentationId.ReportingPeriod]:
      reportingPeriodLabelOrder[segment.reportingPeriod]?.label ?? '',
  };

  return segmentNameFromInfo(info);
};
