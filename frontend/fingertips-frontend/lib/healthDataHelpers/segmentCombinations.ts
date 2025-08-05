import { SegmentationId, SegmentInfo } from '@/lib/common-types';

export const segmentCombinations = (
  segValues: Record<SegmentationId, string[]>
) => {
  const result: SegmentInfo[] = [];
  const sexValues = segValues.sex;
  const ageValues = segValues.age;
  const reportingPeriodValues = segValues.reportingPeriod;

  if (!sexValues.length && !ageValues.length && !reportingPeriodValues.length) {
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

  if (reportingPeriodValues.length === 0) {
    reportingPeriodValues.push('');
  }

  // loop through all 3 segmentations
  sexValues.forEach((sex) => {
    ageValues.forEach((age) => {
      reportingPeriodValues.forEach((reportingPeriod) => {
        result.push({ sex, age, reportingPeriod });
      });
    });
  });

  return result;
};
