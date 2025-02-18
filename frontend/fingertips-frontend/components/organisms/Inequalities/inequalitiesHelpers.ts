import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const groupHealthDataByInequalities = (
  indicatorHealthData: HealthDataForArea
) => {
  return Object.groupBy(indicatorHealthData.healthData, (data) => data.sex);
};
