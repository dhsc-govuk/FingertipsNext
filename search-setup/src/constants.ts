export const INDICATOR_SEARCH_SCORING_PROFILE = 'basicScoringProfile';
export const INDICATOR_SEARCH_INDEX_NAME = 'indicator-search-index';
export const AREA_SEARCH_INDEX_NAME = 'area-search-index';
export const AREA_SEARCH_SUGGESTER_NAME = 'areaSuggester';

export const COUNTY_AREA_TYPE_NAME = 'Counties and Unitary Authorities';
export const DISTRICT_AREA_TYPE_NAME = 'Districts and Unitary Authorities';

export const ONS_AREA_TYPE_CODE_UNITARY_AUTHORITIES = 'E06';
export const ONS_AREA_TYPE_CODE_METROPOLITAN_DISTRICTS = 'E08';
export const ONS_AREA_TYPE_CODE_LONDON_BOROUGHS = 'E09';
export interface IndicatorDocument {
  indicatorId: string;
  name: string;
  definition: string;
  dataSource: string;
  latestDataPeriod: string; // Most recent value held in database column 'Year'.
  lastUpdated: Date;
}

export interface AreaDocument {
  areaKey: string;
  areaCode: string;
  areaType: string;
  areaName: string;
}

export enum IndicatorSearchIndexColumnNames {
  INDICATOR_ID = 'indicatorId',
  INDICATOR_NAME = 'name',
  INDICATOR_DEFINITION = 'definition',
  INDICATOR_LATEST_DATA_PERIOD = 'latestDataPeriod',
  INDICATOR_DATA_SOURCE = 'dataSource',
  INDICATOR_LAST_UPDATED = 'lastUpdated',
}

export enum AreaSearchIndexColumnNames {
  AREA_KEY = 'areaKey',
  AREA_CODE = 'areaCode',
  AREA_NAME = 'areaName',
  AREA_TYPE = 'areaType',
}
