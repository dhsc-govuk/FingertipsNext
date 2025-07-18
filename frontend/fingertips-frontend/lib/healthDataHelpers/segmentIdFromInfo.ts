import { SegmentInfo } from '@/lib/common-types';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const segmentIdFromInfo = (info: SegmentInfo) => {
  const parts = Object.entries(info).map(([key, value]) => {
    if (!value || value === '') return;
    return `${key}:${value}`;
  });

  return parts.filter(filterDefined).join('_').toLowerCase();
};
