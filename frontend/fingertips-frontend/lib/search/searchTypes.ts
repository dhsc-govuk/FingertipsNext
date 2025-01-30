/*********************************************************************************
 * This file includes duplicate definitions from the search-setup/src/constants.ts
 * These should be updated to take definitions from there rather than duplicating them
 */

export const INDICATOR_SEARCH_SCORING_PROFILE = 'basicScoringProfile';
export const INDICATOR_SEARCH_INDEX_NAME = 'indicator-search-index';
export const AREA_SEARCH_INDEX_NAME = 'area-search-index';
export const AREA_SEARCH_SUGGESTER_NAME = 'areaSuggester';
export const AREA_TYPE_GP = 'GPs';

export type IndicatorDocument = {
  indicatorId: string;
  name: string;
  definition: string;
  dataSource: string;
  latestDataPeriod: string;
  lastUpdated: Date;
};

export type AreaDocument = {
  areaCode: string;
  areaType: string;
  areaName: string;
};

export interface IIndicatorSearchService {
  searchWith(searchTerm: string): Promise<IndicatorDocument[]>;
}

export interface IAreaSearchService {
  getArea(areaCode: string): Promise<AreaDocument | undefined>;
  getAreaSuggestions(partialAreaName: string): Promise<AreaDocument[]>;
}
