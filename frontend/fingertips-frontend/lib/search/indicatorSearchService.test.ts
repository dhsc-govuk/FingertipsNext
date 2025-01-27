import { IndicatorSearchService } from './indicatorSearchService';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { SearchServiceFactory } from './searchServiceFactory';
import { INDICATOR_SEARCH_INDEX_NAME } from './searchTypes';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('IndicatorSearchService', () => {
  const mockSearch = jest.fn();

  (SearchClient as jest.Mock).mockImplementation(() => ({
    search: mockSearch,
  }));

  mockSearch.mockResolvedValue({ results: [] });

  describe('if the environment is configured it', () => {
    beforeEach(() => {
      process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = undefined;
      process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
      process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';

      (AzureKeyCredential as jest.Mock).mockImplementation(() => ({
        key: 'test-api-key',
      }));
    });

    it('should successfully create a search service instance', () => {
      const searchService = SearchServiceFactory.getIndicatorSearchService();
      expect(searchService).toBeInstanceOf(IndicatorSearchService);
    });

    it('should call search client with correct parameters', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm);

      expect(SearchClient).toHaveBeenCalledWith(
        'test-url',
        INDICATOR_SEARCH_INDEX_NAME,
        expect.any(Object)
      );

      expect(mockSearch).toHaveBeenLastCalledWith(
        getExpectedSearchTerm(searchTerm),
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
        })
      );
    });

    it('should perform a search operation', async () => {
      const mockSearchResults = {
        latestDataPeriod: undefined,
        results: [
          {
            document: {
              indicatorId: '123',
              name: 'Test Indicator',
              latestDataPeriod: undefined,
              dataSource: 'Test Source',
              lastUpdated: '2024-01-01',
            },
          },
        ],
      };

      mockSearch.mockResolvedValue(mockSearchResults);

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      const results = await searchService.searchWith('Test Indicator');

      expect(results).toEqual([
        {
          indicatorId: '123',
          name: 'Test Indicator',
          latestDataPeriod: undefined,
          dataSource: 'Test Source',
          lastUpdated: '2024-01-01',
        },
      ]);
    });
  });
});

function getExpectedSearchTerm(searchTerm: string): string {
  return `${searchTerm} /.*${searchTerm}.*/`;
}
