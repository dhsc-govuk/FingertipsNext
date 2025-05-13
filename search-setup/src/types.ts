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

/**
 * The synonym data is found in the assets/indicator-synonyms.json directory
 * "keyword": <string>            # The main keyword to be mapped
 * "synonyms": <list of strings>  # A list of synonyms related to the keyword
 * "isExplicit": <boolean>        # A flag that indicates whether the keyword should be one-way mapped or equivalently mapped to its synonyms
 *
 *  Azure synonyms allow explicit (one-way) mapping and equivalent mapping from a keyword to its synonyms
 *  Explicit mapping ensures that a search for the keyword matches results containing its synonyms, but the reverse is not the case
 *  Equivalent mapping ensures that a search for the keyword or its synonyms matches results containing the keyword or its synonyms
 */
export type SynonymData = Array<{
  keyword: string;
  synonyms: string[];
  isExplicit: boolean;
}>;
