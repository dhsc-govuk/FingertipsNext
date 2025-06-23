import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export interface BarChartEmbeddedTableRow extends HealthDataPoint {
  area: string;
  areaCode: string;
}

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  RecentTrend = 'Recent trend',
  Period = 'Period',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
}

export const chartName = 'barChartEmbeddedTable';
export const barChartEmbeddedRowClassName = 'barChartEmbeddedTableRow';
