import {
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { SegmentationId } from '@/lib/common-types';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';

export const findSegment = (
  indicatorSegments: IndicatorSegment[],
  segmentInfo: Record<SegmentationId, string>
) => {
  const values = segmentValues({
    areaHealthData: [{ indicatorSegments }],
  } as IndicatorWithHealthDataForArea);

  const defaultSex = values.sex.at(0) ?? '';
  const defaultAge = values.age.at(0) ?? '';

  let { sex: selectedSex, age: selectedAge } = segmentInfo;

  if (selectedSex === '') {
    selectedSex = defaultSex;
  }

  if (selectedAge === '') {
    selectedAge = defaultAge;
  }

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
