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
  indicatorID: string;
  indicatorName: string;
  indicatorDefinition: string;
  dataSource: string;
  earliestDataPeriod: string; // Oldest value held in database column 'Year'.
  latestDataPeriod: string; // Newest value held in database column 'Year'.
  lastUpdatedDate: Date;
  associatedAreaCodes: string[];
  hasInequalities: boolean;
};

export type AreaDocument = {
  areaCode: string;
  areaType: string;
  areaName: string;
};

export interface IIndicatorSearchService {
  searchWith(
    searchTerm: string,
    areaCodes?: string[]
  ): Promise<IndicatorDocument[]>;
}

export interface IAreaSearchService {
  getAreaDocument(areaCode: string): Promise<AreaDocument | undefined>;
  getAreaSuggestions(partialAreaName: string): Promise<AreaDocument[]>;
}

export function formatAreaName(area: AreaDocument): string {
  return area.areaType === AREA_TYPE_GP
    ? `${area.areaCode} - ${area.areaName}`
    : area.areaName;
}
