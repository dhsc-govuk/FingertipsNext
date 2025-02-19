import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const groupHealthDataByInequalities = (
  healthData: HealthDataPoint[]
) => {
  return Object.groupBy(healthData, (data) => data.sex);
};

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'All',
}
