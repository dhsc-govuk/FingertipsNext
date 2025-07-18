import { SegmentInfo } from '@/lib/common-types';

export const segmentNameFromInfo = (info: SegmentInfo) => {
  const name: string[] = [];

  if (info.sex) {
    name.push(info.sex);
  }

  if (info.age) {
    name.push(info.age);
  }

  if (info.frequency) {
    name.push(info.frequency);
  }

  return name.join(', ');
};
