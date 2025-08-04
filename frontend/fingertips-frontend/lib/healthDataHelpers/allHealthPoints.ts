import {
  HealthDataPoint,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const allHealthPoints = (
  healthData: IndicatorWithHealthDataForArea
): HealthDataPoint[] => {
  return healthData.areaHealthData
    ?.flatMap((area) =>
      area.indicatorSegments?.flatMap((segment) => segment.healthData)
    )
    .filter(filterDefined) as HealthDataPoint[];
};
