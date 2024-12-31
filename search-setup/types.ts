export interface Data {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
  };
}

export interface DocumentResponse {
  "@odata.context": string;
  value: DocumentValue[];
}

interface DocumentValue extends Data {
  "@search.score": number;
}

export interface SearchIndexResponse {
  name: string;
  fields: IndexField[];
  scoringProfiles: ScoringProfile[];
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
    weights: {
      [propertyName: string]: number;
    }
  }
}
