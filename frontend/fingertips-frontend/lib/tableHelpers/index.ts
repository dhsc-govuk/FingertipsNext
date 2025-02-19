export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  BenchmarkTrend = 'Compared to benchmark',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}

export enum InequalitiesSexTableHeadingsEnum {
  PERIOD = 'Period',
  PERSONS = 'Persons',
  MALE = 'Male',
  FEMALE = 'Female',
  BENCHMARK = 'England benchmark',
}

export interface LineChartTableRowData {
  period: number;
  count: number;
  value: number;
  lower: number;
  upper: number;
}

export interface InequalitiesSexTableRowData {
  period: number;
  persons: number | undefined;
  male: number | undefined;
  female: number | undefined;
  englandBenchmark: number | undefined;
}

export const convertToPercentage = (value: number): string => {
  // dummy function to do percentage conversions until real conversion logic is provided
  return `${((value / 10000) * 100).toFixed(1)}%`;
};
