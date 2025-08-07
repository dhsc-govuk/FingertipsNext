import {
  AgeData,
  HealthDataForArea as HealthDataForAreaAPI,
  HealthDataPoint as HealthDataPointAPI,
  IndicatorSegment as IndicatorSegmentAPI,
  IndicatorWithHealthDataForArea as IndicatorWithHealthDataForAreaAPI,
  SexData,
} from '../generated-sources/ft-api-client';

// MUST EXPORT THE * FIRST FROM THE ORIGINAL SOURCES
export * from '../generated-sources/ft-api-client';

// now we can export and override the types that the UI would like to use a little differently
export interface HealthDataPoint extends Omit<HealthDataPointAPI, 'value'> {
  periodLabel?: string; // useful for UI to populate this rather than regenerate over and over
  sex?: SexData;
  ageBand?: AgeData;
  value?: number;
}

export interface IndicatorSegment
  extends Omit<IndicatorSegmentAPI, 'healthData'> {
  healthData?: HealthDataPoint[];
}

export interface HealthDataForArea
  extends Omit<HealthDataForAreaAPI, 'healthData' | 'indicatorSegments'> {
  healthData: HealthDataPoint[]; // deprecated in API but useful for UI
  indicatorSegments?: IndicatorSegment[];
}

export interface IndicatorWithHealthDataForArea
  extends Omit<IndicatorWithHealthDataForAreaAPI, 'areaHealthData'> {
  areaHealthData?: HealthDataForArea[];
}

// export the original types produced by the API - useful when mocking the
// api responses specifically
export type { IndicatorWithHealthDataForAreaAPI };
