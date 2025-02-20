import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export const shouldDisplayInequalities = (
  indicatorsSelected: string[],
  areasSelected: string[]
) => indicatorsSelected.length === 1 && areasSelected.length === 1;

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'All',
}
