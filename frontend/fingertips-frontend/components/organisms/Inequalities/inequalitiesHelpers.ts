import { HealthDataPoint } from '@/generated-sources/ft-api-client';

type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

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
  const yearlyDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  > = {};

  for (const year in yearlyHealthData) {
    yearlyDataGroupedByInequalities[year] = groupHealthDataByInequalities(
      yearlyHealthData[year] ?? []
    );
  }

  return yearlyDataGroupedByInequalities;
};

const mapAllKeyToPersonsKey = (sexKeys: string[]): string[] =>
  sexKeys
    .map((key) => (key === Sex.ALL ? 'Persons' : key))
    .toSorted((a, b) => b.localeCompare(a));

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
  isSex: boolean
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], currentInequalityKeys) => {
    allKeys = [...allKeys, ...Object.keys(currentInequalityKeys)];
    return allKeys;
  }, []);

  const uniqueKeys = [...new Set(existingKeys)];

  return isSex ? mapAllKeyToPersonsKey(uniqueKeys) : uniqueKeys;
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
