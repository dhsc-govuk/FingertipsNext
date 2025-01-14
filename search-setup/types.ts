export interface IndicatorSearchData {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
  };
}

export interface GeographySearchData {
  areaName: string;
  areaType: string;
  areaCode: string;
}

export interface DocumentResponse {
  "@odata.context": string;
  value: IndicatorSearchData[] | GeographySearchData[];
}

export interface SearchIndexResponse {
  name: string;
  fields: IndexField[];
  scoringProfiles: ScoringProfile[];
  defaultScoringProfile: string;
}

export interface IndexField {
  name: string;
  type: string;
  searchable?: boolean;
  filterable?: boolean;
  retrievable?: boolean;
  stored?: boolean;
  sortable?: boolean;
  facetable?: boolean;
  key?: boolean;
  fields?: IndexField[];
}

export interface ScoringProfile {
  name: string;
  text: {
    weights: ScoringWeight;
  };
}

export interface ScoringWeight {
  [propertyName: string]: number;
}

export interface TypeAheadBody {
  search: string;
  suggesterName: string;
}

export interface AutoCompleteResult {
  value: { text: string; queryPlusText: string }[];
}

export interface SuggestionResult {
  value: { "@search.text": string }[];
}
