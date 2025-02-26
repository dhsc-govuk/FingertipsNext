import { HealthDataPoint } from '@/generated-sources/ft-api-client';

type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'All',
}

export enum Inequalities {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

// 'All' -> 'Persons' mapping to be removed when db value is changed in subsequent ticket
export const mapToKey = (key: string): string =>
  key === Sex.ALL ? 'Persons' : key;

export const inequalityKeyMapping: Record<
  Inequalities,
  (keys: string[]) => string[]
> = {
  [Inequalities.Sex]: (sexKeys: string[]) =>
    sexKeys.map((key) => mapToKey(key)).toSorted((a, b) => b.localeCompare(a)),
  [Inequalities.Deprivation]: (keys: string[]) => keys,
};

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
  const yearlyDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities =
    {};

  for (const year in yearlyHealthData) {
    yearlyDataGroupedByInequalities[year] = groupHealthDataByInequalities(
      yearlyHealthData[year] ?? []
    );
  }

  return yearlyDataGroupedByInequalities;
};

export const getDynamicKeys = (
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
  type: Inequalities
): string[] => {
  const existingKeys = Object.values(
    yearlyHealthDataGroupedByInequalities
  ).reduce((allKeys: string[], currentInequalityKeys) => {
    allKeys = [...allKeys, ...Object.keys(currentInequalityKeys)];
    return allKeys;
  }, []);

  const uniqueKeys = [...new Set(existingKeys)];

  return inequalityKeyMapping[type](uniqueKeys);
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;
