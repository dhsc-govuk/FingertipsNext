import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const groupHealthDataByYear = (healthData: HealthDataPoint[]) =>
  Object.groupBy(healthData, (data) => data.year);

export const groupHealthDataByInequalities = (
  healthData: HealthDataPoint[]
) => {
  return Object.groupBy(healthData, (data) => data.sex);
};

export const getYearDataGroupedByInequalities = (
  yearlyHealthData: Record<string, HealthDataPoint[] | undefined>
) => {
  let yearlyDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  > = {};

  for (const year in yearlyHealthData) {
    yearlyDataGroupedByInequalities = {
      ...yearlyDataGroupedByInequalities,
      [year]: groupHealthDataByInequalities(yearlyHealthData[year] ?? []),
    };
  }

  return yearlyDataGroupedByInequalities;
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >,
  isSex: boolean
) => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], value) => {
    allKeys = [...allKeys, ...Object.keys(value)];
    return allKeys;
  }, []);

  return isSex
    ? [...new Set(existingKeys)]
        .map((header) => (header === Sex.ALL ? 'Persons' : header))
        .toSorted((a, b) => b.localeCompare(a))
    : [...new Set(existingKeys)];
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[],
  areasSelected: string[]
) => indicatorsSelected.length === 1 && areasSelected.length === 1;

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'All',
}
