import { Options } from 'highcharts';
import { AreaTypeKeysForMapMeta } from '@/components/charts/ThematicMap/helpers/thematicMapHelpers';

export enum ExportType {
  PNG = 'png',
  SVG = 'svg',
  CSV = 'csv',
}

export interface ElementInfo {
  element?: HTMLElement | SVGSVGElement;
  width: number;
  height: number;
}

export enum CsvHeader {
  IndicatorId = 'Indicator ID',
  IndicatorName = 'Indicator name',
  Period = 'Period',
  Area = 'Area',
  AreaCode = 'Area code',
  Benchmark = 'Benchmark',
  BenchmarkComparison = 'Compared to benchmark',
  RecentTrend = 'Recent trend',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  LowerCI = 'Lower confidence limit X%',
  UpperCI = 'Upper confidence limit X%',
  InequalityCategory = 'Inequality category',
  InequalityType = 'Inequality type',
  AgeRange = 'Age range',
  Male = 'Male',
  Female = 'Female',
  WorstLowest = 'Worst/Lowest',
  BestHighest = 'Best/Highest',
  PersonsComparison = 'Compared to persons',
  Totals = 'Totals',
}

export interface CustomOptions extends Options {
  custom?: {
    mapAreaType?: AreaTypeKeysForMapMeta;
  };
}
