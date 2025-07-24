import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { SegmentationId } from '@/lib/common-types';

export const findSegment = (
  indicatorSegments: IndicatorSegment[],
  segmentInfo: Record<SegmentationId, string>
) => {
  const { sex: selectedSex, age: selectedAge } = segmentInfo;
  return indicatorSegments.find((segment) => {
    const { sex, age } = segment;
    const sexMatch =
      !sex ||
      (!selectedSex && sex.isAggregate) ||
      sex.value.toLowerCase() === selectedSex?.toLowerCase();

    const ageMatch =
      !age ||
      (!selectedAge && age.isAggregate) ||
      age.value.toLowerCase() === selectedAge?.toLowerCase();

    const freqMatch = true;
    return sexMatch && ageMatch && freqMatch;
  });
};
