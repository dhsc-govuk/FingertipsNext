/*********************************************************************************
 * This file includes duplicate definitions from the search-setup/src/constants.ts
 * These should be updated to take definitions from there rather than duplicating them
 */

import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';

export const INDICATOR_SEARCH_SCORING_PROFILE = 'basicScoringProfile';
export const INDICATOR_SEARCH_INDEX_NAME = 'indicator-search-index';
export const AREA_SEARCH_INDEX_NAME = 'area-search-index';
export const AREA_SEARCH_SUGGESTER_NAME = 'areaSuggester';
export const AREA_TYPE_GP = 'GPs';

export interface AreaCodeWithTrend {
  areaCode: string;
  trend: HealthDataPointTrendEnum;
}

export type RawIndicatorDocument = {
  indicatorID: string;
  indicatorName: string;
  indicatorDefinition: string;
  dataSource: string;
  earliestDataPeriod: string; // Oldest value held in database column 'Year'.
  latestDataPeriod: string; // Newest value held in database column 'Year'.
  lastUpdatedDate: Date;
  associatedAreaCodes: string[];
  trendsByArea: AreaCodeWithTrend[];
  hasInequalities: boolean;
  unitLabel: string;
  usedInPoc: boolean; // data maps to search-setup/assets/indicators.csv
};

export type IndicatorDocument = {
  indicatorID: string;
  indicatorName: string;
  indicatorDefinition: string;
  trend?: HealthDataPointTrendEnum;
  dataSource: string;
  earliestDataPeriod: string; // Oldest value held in database column 'Year'.
  latestDataPeriod: string; // Newest value held in database column 'Year'.
  lastUpdatedDate: Date;
  hasInequalities: boolean;
  unitLabel: string;
};

export type AreaDocument = {
  areaCode: string;
  areaType: string;
  areaName: string;
};

export interface IIndicatorSearchService {
  searchWith(
    searchTerm: string,
    isEnglandSelectedAsGroup: boolean,
    areaCodes?: string[]
  ): Promise<IndicatorDocument[]>;
  getIndicator(indicatorId: string): Promise<IndicatorDocument | undefined>;
}

export interface IAreaSearchService {
  getAreaDocument(areaCode: string): Promise<AreaDocument | undefined>;
  getAreaSuggestions(partialAreaName: string): Promise<AreaDocument[]>;
}
