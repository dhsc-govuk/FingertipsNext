import { SegmentInfo } from '@/lib/common-types';

export const segmentIdFromInfo = (
  indicatorId: number | string,
  info: SegmentInfo
) => {
  const query = new URLSearchParams();

  Object.entries(info).forEach(([key, value]) => {
    if (!value || value === '') return;
    query.append(key.toLowerCase(), value.toLowerCase());
  });
  const queryString = query.toString();
  if (queryString.length === 0) return `${indicatorId}`;

  return `${indicatorId}?${queryString}`;
};
