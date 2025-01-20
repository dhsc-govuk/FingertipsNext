export type AreaDocument = {
  areaCode: string;
  areaType: string;
  areaName: string;
};

export interface IndicatorSearchResult {
  indicatorId: string;
  indicatorName: string;
  latestDataPeriod?: string;
  dataSource?: string;
  lastUpdated?: Date;
}

export interface IAreaSearchClient {
  getAreaSuggestions(partialAreaName: string): Promise<AreaDocument[]>;
}

export interface IIndicatorSearchClient {
  searchWith(searchTerm: string): Promise<IndicatorSearchResult[]>;
}
