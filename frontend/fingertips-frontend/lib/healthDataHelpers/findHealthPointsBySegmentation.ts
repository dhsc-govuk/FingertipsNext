import {
  HealthDataPoint,
  IndicatorSegment,
} from '@/generated-sources/ft-api-client';
import { SegmentationId } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';

export const findHealthPointsBySegmentation = (
  indicatorSegments: IndicatorSegment[],
  segmentInfo: Record<SegmentationId, string>
): HealthDataPoint[] => {
  const selectedSegSex = segmentInfo[SegmentationId.Sex];
  const matchingSegment = indicatorSegments.find((segment) => {
    const { sex } = segment;
    const sexMatch =
      (!selectedSegSex && sex.isAggregate) ||
      sex.value.toLowerCase() === selectedSegSex?.toLowerCase();
    const ageMatch = true;
    const freqMatch = true;

    return sexMatch && ageMatch && freqMatch;
  });

  return matchingSegment?.healthData ?? [];
};
