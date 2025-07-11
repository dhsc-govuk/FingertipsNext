import type { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

export enum BasicTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export interface BasicTableData {
  indicatorId?: number;
  indicatorName?: string;
  areaName?: string;
  areaCode?: string;
  period?: string;
  unitLabel?: string;
  count?: number;
  value?: number;
  trend?: HealthDataPointTrendEnum;
}
