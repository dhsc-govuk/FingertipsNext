import { SearchService } from './searchService';
import { SearchServiceMock } from './searchServiceMock';
import {
  EnvironmentContext,
  DHSC_AI_SEARCH_USE_MOCK_SERVICE,
} from '../environmentContext';

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

const useMockService: boolean =
  EnvironmentContext.getEnvironmentMap().get(
    DHSC_AI_SEARCH_USE_MOCK_SERVICE
  ) === 'true';
const searchService = useMockService
  ? new SearchServiceMock()
  : new SearchService();

export const getSearchService = (): Search => {
  return searchService;
};
