import {
  HealthDataForArea,
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';

export const heatmapIndicatorTitleColumnWidth = 240;
export const heatmapDataColumnWidth = 60;

export enum HeaderType {
  IndicatorTitle,
  Period,
  ValueUnit,
  BenchmarkGroupArea,
  NonBenchmarkGroupArea,
  Area,
}
export enum CellType {
  IndicatorTitle,
  IndicatorPeriod,
  IndicatorValueUnit,
  Data,
}

export interface HeatmapIndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

export interface HeatmapDataRow {
  key: string;
  cells: HeatmapDataCell[];
}

export interface DataCellHoverProps {
  areaName: string;
  period: number;
  indicatorName: string;
  value?: number;
  unitLabel: string;
  benchmark: DataPointBenchmark;
}

export interface HeatmapDataCell {
  key: string;
  type: CellType;
  content: string;
  backgroundColour?: string;
  hoverProps?: DataCellHoverProps;
}

export type HeatmapBenchmarkOutcome = BenchmarkOutcome | 'Baseline';

export interface DataPointBenchmark {
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkAreaCode?: string;
}
