import { IndicatorSegment } from '@/generated-sources/ft-api-client';

export const segmentName = (segment: IndicatorSegment) => {
  const name: string[] = [];

  if (segment.sex.value) {
    name.push(segment.sex.value);
  }

  return name.join(', ');
};
