import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  Frequency,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

import { SegmentInfo } from '@/lib/common-types';

export interface HeatmapIndicatorData {
  rowId: string;
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  segmentInfo: SegmentInfo;
  frequency: Frequency;
  isSmallestReportingPeriod: boolean;
}

export interface Area {
  code: string;
  position?: number;
  name: string;
}

export interface Indicator {
  rowId: string;
  indicatorId: string;
  position?: number;
  name: string;
  unitLabel: string;
  latestDataPeriod: string;
  benchmarkMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export interface DataPoint {
  value?: number;
  areaCode: string;
  indicatorId: string;
  benchmark?: Benchmark;
}

export interface HeatmapData {
  areas: Area[];
  indicators: Indicator[];
  dataPoints: Record<string, Record<string, DataPoint>>;
}

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

export interface Cell {
  key: string;
  type: CellType;
  content: string;
  backgroundColour?: string;
  hoverProps?: CellHoverProps;
}

export interface CellHoverProps {
  areaName: string;
  period: string;
  indicatorName: string;
  value?: number;
  unitLabel: string;
  benchmark: Benchmark;
}

export interface Row {
  key: string;
  cells: Cell[];
}

export type HeatmapBenchmarkOutcome = BenchmarkOutcome | 'Baseline';

export interface Benchmark {
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkAreaCode?: string;
}

export interface Header {
  key: string;
  type: HeaderType;
  content: string;
}
