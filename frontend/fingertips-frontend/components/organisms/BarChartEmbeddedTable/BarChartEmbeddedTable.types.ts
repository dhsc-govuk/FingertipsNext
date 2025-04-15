import {
  HealthDataPointBenchmarkComparison,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';

export interface BarChartEmbeddedTableRow {
  area: string;
  period: string;
  trend: HealthDataPointTrendEnum;
  count?: number;
  value?: number;
  lowerCi?: number;
  upperCi?: number;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
}
