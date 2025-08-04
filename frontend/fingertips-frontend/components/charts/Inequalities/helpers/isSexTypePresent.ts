import { IndicatorSegment } from '@/generated-sources/ft-api-client';

export const isSexTypePresent = (
  indicatorSegments: IndicatorSegment[]
): boolean => {
  return indicatorSegments?.some((segment) => {
    const isNotAggregateOfSex = !segment.sex.isAggregate;
    const hasDataPoints = segment.healthData?.length ?? 0 >= 1;
    return isNotAggregateOfSex && hasDataPoints;
  });
};
