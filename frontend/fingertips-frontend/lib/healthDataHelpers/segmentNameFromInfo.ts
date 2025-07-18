import { SegmentationId } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';

export const segmentNameFromInfo = (info: Record<SegmentationId, string>) => {
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
