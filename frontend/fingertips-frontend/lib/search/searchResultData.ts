import { SearchService } from './searchService';
import { SearchServiceMock } from './searchServiceMock';

export interface IndicatorSearchResult {
  id: string;
  indicatorName: string;
  latestDataPeriod?: string;
  dataSource?: string;
  lastUpdated?: string;
}

export interface Search {
  searchWith(searchTerm: string): Promise<IndicatorSearchResult[]>;
}

let searchService: Search;
try {
  searchService = new SearchService();
} catch {
  // Handle error
  searchService = new SearchServiceMock();
}

export const getSearchService = (): Search => {
  return searchService;
};
