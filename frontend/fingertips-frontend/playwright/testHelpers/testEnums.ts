export enum SearchMode {
  ONLY_SUBJECT = 'ONLY_SUBJECT',
  ONLY_AREA = 'ONLY_AREA',
  BOTH_SUBJECT_AND_AREA = 'BOTH_SUBJECT_AND_AREA',
}

export enum IndicatorMode {
  ONE_INDICATOR = 'ONE_INDICATOR',
  TWO_INDICATORS = 'TWO_INDICATORS',
  THREE_PLUS_INDICATORS = 'THREE_PLUS_INDICATORS',
}

export enum AreaMode {
  ONE_AREA = 'ONE_AREA',
  TWO_AREAS = 'TWO_AREAS',
  THREE_PLUS_AREAS = 'THREE_PLUS_AREAS',
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}

// Tags to mark when certain tests should be run
export enum TestTag {
  CI = '@ci',
  CD = '@cd',
}

export interface IndicatorInfo {
  indicatorID: string;
  knownTrend?: string;
}

export interface SimpleIndicatorDocument {
  indicatorID: string;
  indicatorName: string;
  associatedAreaCodes: string[];
  dataSource: string;
  knownTrend?: string;
}

export interface AreaFilters {
  areaType: string;
  groupType: string;
  group: string;
}

export interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
  indicatorsToSelect: IndicatorInfo[];
  subjectSearchTerm?: string;
  areaFiltersToSelect?: AreaFilters;
}
