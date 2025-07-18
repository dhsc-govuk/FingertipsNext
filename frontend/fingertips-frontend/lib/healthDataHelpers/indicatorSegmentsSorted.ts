import { IndicatorSegment } from '@/generated-sources/ft-api-client';

export const indicatorSegmentsSorted = (
  indicatorSegments: IndicatorSegment[]
) => {
  return indicatorSegments.toSorted((a, b) => {
    const aSex = a.sex.value;
    const bSex = b.sex.value;
    const compareSex = bSex.localeCompare(aSex);
    if (compareSex !== 0) return compareSex;
    // compare other segmentation options when they are available
    return 0;
  });
};
