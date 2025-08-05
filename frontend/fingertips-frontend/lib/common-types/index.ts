import { Area } from '@/generated-sources/ft-api-client';

export enum Trend {
  INCREASING = 'Increasing',
  DECREASING = 'Decreasing',
  NO_SIGNIFICANT_CHANGE = 'No significant change',
  NOT_AVAILABLE = 'No recent trend data available',
}

export enum TrendCondition {
  GETTING_BETTER = 'getting better',
  GETTING_WORSE = 'getting worse',
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',
}

export type AreaWithoutAreaType = Pick<Area, 'code' | 'name'>;

export enum SegmentationId {
  Sex = 'sex',
  Age = 'age',
  ReportingPeriod = 'reportingPeriod',
}

export type SegmentInfo = Record<SegmentationId, string>;
