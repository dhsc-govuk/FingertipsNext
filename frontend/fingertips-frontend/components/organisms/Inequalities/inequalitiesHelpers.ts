import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export interface InequalitiesLineChartTableData {
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartData {
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
  ALL = 'All',
}

export enum InequalitiesTypes {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

// 'All' -> 'Persons' mapping to be removed when db value is changed in subsequent ticket
export const mapToKey = (key: string): string =>
  key === Sex.ALL ? 'Persons' : key;

export const inequalityKeyMapping: Record<
  InequalitiesTypes,
  (keys: string[]) => string[]
> = {
  [InequalitiesTypes.Sex]: (sexKeys: string[]) =>
    sexKeys.map((key) => mapToKey(key)).toSorted((a, b) => b.localeCompare(a)),
  [InequalitiesTypes.Deprivation]: (keys: string[]) => keys,
};

export const inequalitiesBenchmarkColumnMapping: Record<
  InequalitiesTypes,
  string
> = {
  [InequalitiesTypes.Sex]: 'Persons',
  [InequalitiesTypes.Deprivation]: 'England',
};

// export const mapToGetBenchmarkData: Record<InequalitiesTypes, (rowData: InequalitiesTableRowData[]) => BenchmarkColumn> = {
//   [InequalitiesTypes.Sex]: (row)
// }

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
        acc[mapToKey(current)] = currentTableKey?.at(0)
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
  type: InequalitiesTypes
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

// export const getBenchmarkData = (
//   type: InequalitiesTypes,
//   yearDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities,
//   englandData: HealthDataPoint[]
// ) => {};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;
