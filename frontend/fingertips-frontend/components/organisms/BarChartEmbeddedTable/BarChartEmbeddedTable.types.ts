import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export interface BarChartEmbeddedTableRow extends HealthDataPoint {
  area: string;
  areaCode: string;
}
