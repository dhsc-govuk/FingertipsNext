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
  value: { '@search.text': string }[];
}

export type SynonymData = Record<
  string,
  {
    terms: string[];
    isAcronym: boolean;
  }
>;
