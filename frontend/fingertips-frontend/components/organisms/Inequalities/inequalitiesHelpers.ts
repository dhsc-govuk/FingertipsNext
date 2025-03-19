import {
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
} from '@/generated-sources/ft-api-client';
import { UniqueChartColours } from '@/lib/chartHelpers/colours';
import { isEnglandSoleSelectedArea } from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { chartSymbols } from '../LineChart/lineChartHelpers';

export type YearlyHealthDataGroupedByInequalities = Record<
  string,
  Record<string, HealthDataPoint[] | undefined>
>;

export interface InequalitiesChartData {
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
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
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
  PERSONS = 'Persons',
}

export enum InequalitiesTypes {
  Sex = 'sex',
  Deprivation = 'deprivation',
}

const mapToChartColorsForInequality: Record<InequalitiesTypes, string[]> = {
  [InequalitiesTypes.Sex]: [
    GovukColours.Orange,
    UniqueChartColours.OtherLightBlue,
    GovukColours.Purple,
  ],
  [InequalitiesTypes.Deprivation]: [],
};

export const inequalityKeyMapping: Record<
  InequalitiesTypes,
  (keys: string[]) => string[]
> = {
  [InequalitiesTypes.Sex]: (sexKeys: string[]) =>
    sexKeys.toSorted((a, b) => b.localeCompare(a)),
  [InequalitiesTypes.Deprivation]: (keys: string[]) => keys,
};

const mapToGetBenchmarkFunction: Record<
  InequalitiesTypes,
  (barChartData: InequalitiesBarChartData) => number | undefined
> = {
  [InequalitiesTypes.Sex]: (barChartData: InequalitiesBarChartData) =>
    barChartData.data.inequalities[Sex.PERSONS]?.value,
  [InequalitiesTypes.Deprivation]: (_: InequalitiesBarChartData) => 5, // random value to be changed when function for deprivation is added
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
              benchmarkComparison: currentTableKey[0].benchmarkComparison,
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

export const getBenchmarkData = (
  type: InequalitiesTypes,
  barChartData: InequalitiesBarChartData
): number | undefined => {
  return mapToGetBenchmarkFunction[type](barChartData);
};

export const generateInequalitiesLineChartSeriesData = (
  keys: string[],
  type: InequalitiesTypes,
  rowData: InequalitiesTableRowData[],
  areasSelected: string[]
): Highcharts.SeriesOptionsType[] => {
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
      symbol: chartSymbols[index % chartSymbols.length],
    },
    color: colorList[index % colorList.length],
  }));

  return seriesData;
};

export const shouldDisplayInequalities = (
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
) => indicatorsSelected.length === 1 && areasSelected.length === 1;
