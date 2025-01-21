export interface IndicatorSearchResult {
  indicatorId: string;
  indicatorName: string;
  latestDataPeriod?: string;
  dataSource?: string;
  lastUpdated?: Date;
}

export interface IIndicatorSearchClient {
  searchWith(searchTerm: string): Promise<IndicatorSearchResult[]>;
}

export type AreaDocument = {
  areaCode: string;
  areaType: string;
  areaName: string;
};

export interface IAreaSearchService {
  getAreaSuggestions(partialAreaName: string): Promise<AreaDocument[]>;
}

export const INDICATOR_SEARCH_INDEX_NAME = 'indicator-search-index';
export const AREA_SEARCH_INDEX_NAME = 'geography-search-index';
export const AREA_SEARCH_SUGGESTER_NAME = 'geographySuggester';
