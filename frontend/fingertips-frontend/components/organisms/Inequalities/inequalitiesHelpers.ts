import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export interface InequalitiesLineChartTableData {
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartTableData {
  areaName: string;
  data: InequalitiesTableRowData;
}

export interface RowDataFields {
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
}

export interface InequalitiesTableRowData {
  period: number;
  inequalities: {
    [key: string]: RowDataFields | undefined;
  };
}

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  ALL = 'Persons',
}

export enum Inequalities {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

export const inequalityKeyMapping: Record<
  Inequalities,
  (keys: string[]) => string[]
> = {
  [Inequalities.Sex]: (sexKeys: string[]) =>
    sexKeys.toSorted((a, b) => b.localeCompare(a)),
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

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((key) => {
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[key]
    ).reduce(
      (acc: Record<string, RowDataFields | undefined>, current: string) => {
        const currentTableKey = yearDataGroupedByInequalities[key][current];
        acc[current] = currentTableKey?.at(0)
          ? {
              count: currentTableKey[0].count,
              value: currentTableKey[0].value,
              lower: currentTableKey[0].lowerCi,
              upper: currentTableKey[0].upperCi,
            }
          : undefined;
        return acc;
      },
      {}
    );

    return { period: Number(key), inequalities: { ...dynamicFields } };
  });
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
