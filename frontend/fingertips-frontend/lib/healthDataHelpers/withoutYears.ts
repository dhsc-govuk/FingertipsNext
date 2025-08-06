import {
  HealthDataPoint,
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

// temporary function to remove deprecated properties from objects that still
// supply them to allow a gradual shift over to using the new structure

export const withoutYears = (
  indicator: IndicatorWithHealthDataForArea,
  options = { removeAge: false, removeSex: false }
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
          healthData: segment?.healthData?.map((point): HealthDataPoint => {
            const newPoint = { ...point, year: 0 };
            if (options.removeAge) {
              newPoint.ageBand = { value: 'deprecated', isAggregate: false };
            }
            if (options.removeSex) {
              newPoint.sex = { value: 'deprecated', isAggregate: false };
            }
            return newPoint;
          }),
        })
      ),
    })),
  };
};
