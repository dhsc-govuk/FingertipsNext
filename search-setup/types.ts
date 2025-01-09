export interface IndicatorSearchData {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
  };
}

export interface GeographySearchData {
  ID: string;
  Name: string;
  Type: string;
  Postcode: string;
}

export interface DocumentResponse {
  "@odata.context": string;
  value: IndicatorSearchData[] | GeographySearchData[];
}

export interface SearchIndexResponse {
  name: string;
  fields: IndexField[];
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
