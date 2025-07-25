import {
  HealthDataPoint,
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export const withoutYears = (
  indicator: IndicatorWithHealthDataForArea
): IndicatorWithHealthDataForArea => {
  const { areaHealthData = [] } = indicator;
  return {
    ...indicator,
    areaHealthData: areaHealthData.map((item) => ({
      ...item,
      healthData: [],
      indicatorSegments: item?.indicatorSegments?.map(
        (segment): IndicatorSegment => ({
          ...segment,
          healthData: segment?.healthData?.map(
            (point): HealthDataPoint => ({
              ...point,
              year: 0,
            })
          ),
        })
      ),
    })),
  };
};
