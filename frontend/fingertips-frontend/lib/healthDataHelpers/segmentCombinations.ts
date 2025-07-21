import { SegmentationId, SegmentInfo } from '@/lib/common-types';

export const segmentCombinations = (
  segValues: Record<SegmentationId, string[]>
) => {
  const result: SegmentInfo[] = [];
  const sexValues = segValues.sex;
  const ageValues = segValues.age;
  const frequencyValues = segValues.frequency;

  if (!sexValues.length && !ageValues.length && !frequencyValues.length) {
    // there are no combinations in any segmentation
    return [];
  }

  // there must be at least one item in each array for the nested foreach
  // to get to the next segmentation
  if (sexValues.length === 0) {
    sexValues.push('');
  }

  if (ageValues.length === 0) {
    ageValues.push('');
  }

  if (frequencyValues.length === 0) {
    frequencyValues.push('');
  }

  // loop through all 3 segmentations
  sexValues.forEach((sex) => {
    ageValues.forEach((age) => {
      frequencyValues.forEach((frequency) => {
        result.push({ sex, age, frequency });
      });
    });
  });

  return result;
};
