import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { ChartColours } from '@/lib/chartHelpers/colours';
import { SymbolKeyValue } from 'highcharts';
import { isEnglandSoleSelectedArea } from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export interface InequalitiesChartData {
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
  ALL = 'All',
}

export enum Inequalities {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

export const mapToChartSymbolsForInequality: Record<
  Inequalities,
  SymbolKeyValue[]
> = {
  [Inequalities.Sex]: ['circle', 'square', 'diamond'],
  [Inequalities.Deprivation]: [],
};

export const mapToChartColorsForInequality: Record<Inequalities, string[]> = {
  [Inequalities.Sex]: [
    ChartColours.Orange,
    ChartColours.OtherLightBlue,
    ChartColours.Purple,
  ],
  [Inequalities.Deprivation]: [],
};

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

export const generateInequalitiesLineChartSeriesData = (
  keys: string[],
  type: Inequalities,
  rowData: InequalitiesTableRowData[],
  areasSelected: string[]
): Highcharts.SeriesOptionsType[] => {
  const markerList = mapToChartSymbolsForInequality[type];
  const colorList = mapToChartColorsForInequality[type];

  if (isEnglandSoleSelectedArea(areasSelected))
    colorList[0] = GovukColours.Black;

  const seriesData: Highcharts.SeriesOptionsType[] = keys.map((key, index) => ({
    type: 'line',
    name: key,
    data: rowData.map((periodData) => [
      periodData.period,
      periodData.inequalities[key]?.value,
    ]),
    marker: {
      symbol: markerList[index % markerList.length],
    },
    color: colorList[index % colorList.length],
  }));

  return seriesData;
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;
