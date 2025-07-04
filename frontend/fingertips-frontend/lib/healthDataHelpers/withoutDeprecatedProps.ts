import {
  HealthDataForArea,
  HealthDataPoint,
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export const IndicatorWithHealthDataForAreaWithoutDeprecatedProps = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea
): IndicatorWithHealthDataForArea => ({
  ...indicatorWithHealthDataForArea,
  areaHealthData:
    indicatorWithHealthDataForArea.areaHealthData?.map(
      healthDataForAreaWithoutDeprecatedProps
    ) ?? [],
});

export const healthDataForAreaWithoutDeprecatedProps = (
  healthDataForArea: HealthDataForArea
): HealthDataForArea => {
  const { areaCode, areaName, indicatorSegments } = healthDataForArea;
  const indicatorSegmentsWithoutDeprecation = indicatorSegments?.map(
    indicatorSegmentsWithoutDeprecatedProps
  );

  return {
    areaCode,
    areaName,
    healthData: [],
    indicatorSegments: indicatorSegmentsWithoutDeprecation ?? [],
  };
};

export const indicatorSegmentsWithoutDeprecatedProps = (
  indicatorSegment: IndicatorSegment
): IndicatorSegment => ({
  ...indicatorSegment,
  healthData:
    indicatorSegment.healthData?.map(healthDataPointWithoutDeprecatedProps) ??
    [],
});

export const healthDataPointWithoutDeprecatedProps = (
  healthDataPoint: HealthDataPoint
): HealthDataPoint => ({
  ...healthDataPoint,
  sex: { value: 'deprecated', isAggregate: false },
});
