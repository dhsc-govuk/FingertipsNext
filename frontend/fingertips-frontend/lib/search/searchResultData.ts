import { IndicatorSearchService } from './indicatorSearchService';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import {
  EnvironmentContext,
  DHSC_AI_SEARCH_USE_MOCK_SERVICE,
} from '../environmentContext';
import { IIndicatorSearchClient } from './searchTypes';

const useMockService: boolean =
  EnvironmentContext.getEnvironmentMap().get(
    DHSC_AI_SEARCH_USE_MOCK_SERVICE
  ) === 'true';
const searchService = useMockService
  ? new IndicatorSearchServiceMock()
  : new IndicatorSearchService();

export const getSearchService = (): IIndicatorSearchClient => {
  return searchService;
};
