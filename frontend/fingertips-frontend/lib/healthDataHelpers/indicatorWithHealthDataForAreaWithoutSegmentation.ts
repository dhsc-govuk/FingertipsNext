import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export const indicatorWithHealthDataForAreaWithoutSegmentation = (
  indicator: IndicatorWithHealthDataForArea
): IndicatorWithHealthDataForArea => {
  const { areaHealthData = [] } = indicator;
  return {
    ...indicator,
    areaHealthData: areaHealthData.map((item) => ({
      ...item,
      indicatorSegments: undefined,
      healthData:
        item.indicatorSegments?.flatMap(
          (segment) =>
            segment.healthData?.map((point) => {
              const newPoint = {
                ...point,
                year: point.datePeriod?.from.getFullYear() ?? 0,
              };
              if (segment.sex) {
                newPoint.sex = segment.sex;
              }
              if (segment.age) {
                newPoint.ageBand = segment.age;
              }
              return newPoint;
            }) ?? []
        ) ?? ([] as HealthDataPoint[]),
    })),
  };
};
