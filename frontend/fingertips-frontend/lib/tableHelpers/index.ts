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
  persons: number;
  male: number;
  female: number;
  englandBenchmark: number;
}

export function sortPeriod(
  tableRowData: (LineChartTableRowData | InequalitiesSexTableRowData)[]
): (LineChartTableRowData | InequalitiesSexTableRowData)[] {
  return tableRowData.toSorted((a, b) => a.period - b.period);
}
