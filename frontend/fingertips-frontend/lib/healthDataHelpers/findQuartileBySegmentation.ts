import { QuartileData } from '@/generated-sources/ft-api-client';
import { SegmentInfo } from '@/lib/common-types';

export const findQuartileBySegmentation = (
  quartiles: QuartileData[],
  indicatorId: number,
  segment: SegmentInfo
) => {
  const { sex: selectedSex, age: selectedAge } = segment;

  return quartiles.find((quartile) => {
    if (quartile.indicatorId !== indicatorId) return false;

    const { sex, age } = quartile;

    const sexMatch =
      (!selectedSex && sex?.isAggregate) ||
      sex?.value.toLowerCase() === selectedSex?.toLowerCase();

    const ageMatch =
      (!selectedAge && age?.isAggregate) ||
      age?.value.toLowerCase() === selectedAge?.toLowerCase();

    const freqMatch = true;

    return sexMatch && ageMatch && freqMatch;
  });
};
