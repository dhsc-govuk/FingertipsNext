import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

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

export type SignInAs = {
  administrator?: boolean;
  userWithIndicatorPermissions?: boolean;
  userWithoutIndicatorPermissions?: boolean;
};

export interface TestParameters {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
  indicatorsToSelect: IndicatorInfo[];
  subjectSearchTerm?: string;
  areaFiltersToSelect?: AreaFilters;
  checkExports?: boolean;
  typeOfInequalityToSelect?: InequalitiesTypes;
  signInAsUserToCheckUnpublishedData?: SignInAs;
}

export enum PersistentCsvHeaders {
  IndicatorId = 'Indicator ID',
  IndicatorName = 'Indicator name',
  Period = 'Period',
  Area = 'Area',
  AreaCode = 'Area code',
}

type BaseChartComponentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasInequalitiesTimePeriodDropDown?: boolean;
  hasInequalityTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
  hasBenchmarkComparisons?: boolean;
  hasPNGExport?: boolean;
  hasSVGExport?: boolean;
  hasCSVExport?: boolean;
  hasTooltipHovers?: boolean;
  canShowUnpublishedData?: boolean;
};

export type ChartComponentDefinition = {
  chartComponentLocator: string;
  chartComponentProps: BaseChartComponentProps;
};

export const ACCESSIBILITY_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
] as const;
