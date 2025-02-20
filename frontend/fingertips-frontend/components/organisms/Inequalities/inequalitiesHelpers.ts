import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'All',
}
