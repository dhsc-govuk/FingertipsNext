import {
  Frequency,
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { isSmallestReportingPeriod } from '@/lib/healthDataHelpers/isSmallestReportingPeriod';

export const indicatorWithHealthDataForAreaWithoutSegmentation = (
  indicator: IndicatorWithHealthDataForArea
): IndicatorWithHealthDataForArea => {
  const { areaHealthData = [], frequency = Frequency.Annually } = indicator;
  return {
    ...indicator,
    areaHealthData: areaHealthData.map((item) => ({
      ...item,
      indicatorSegments: undefined,
      healthData:
        item.indicatorSegments?.flatMap(
          (segment) =>
            segment.healthData?.map((point) => {
              const newPoint: HealthDataPoint = {
                ...point,
                periodLabel: formatDatePointLabel(
                  point.datePeriod,
                  frequency,
                  isSmallestReportingPeriod(
                    segment.reportingPeriod,
                    [],
                    frequency
                  )
                ),
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
