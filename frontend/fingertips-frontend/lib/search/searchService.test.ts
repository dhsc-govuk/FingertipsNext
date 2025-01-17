import { SearchService } from './searchService';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { EnvironmentContext } from '../environmentContext';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('SearchService', () => {
  describe('if the environment is configured it', () => {
    const mockSearch = jest.fn();

    (SearchClient as jest.Mock).mockImplementation(() => ({
      search: mockSearch,
    }));

    mockSearch.mockResolvedValue({ results: [] });

    beforeEach(() => {
      process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
      process.env.DHSC_AI_SEARCH_INDEX_NAME = 'test-index';
      process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';
      EnvironmentContext.reset();

      (AzureKeyCredential as jest.Mock).mockImplementation(() => ({
        key: 'test-api-key',
      }));
    });

    it('should successfully create a search service instance', () => {
      const searchService = new SearchService();
      expect(searchService).toBeInstanceOf(SearchService);
    });

    it('should call search client with correct parameters', async () => {
      const searchTerm = 'test-search';

      const searchService = new SearchService();
      await searchService.searchWith(searchTerm);

      expect(SearchClient).toHaveBeenCalledWith(
        'test-url',
        'test-index',
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
              dataSource: 'Test Source',
              lastUpdated: '2024-01-01',
            },
          },
        ],
      };

      (SearchClient as jest.Mock).mockImplementation(() => ({
        search: jest.fn().mockResolvedValue(mockSearchResults),
      }));

      const searchService = new SearchService();
      const results = await searchService.searchWith('test-search');

      expect(results).toEqual([
        {
          indicatorId: '123',
          indicatorName: 'Test Indicator',
          latestDataPeriod: undefined,
          dataSource: 'Test Source',
          lastUpdated: '2024-01-01',
        },
      ]);
    });
  });

  describe('if the environment configuration includes a scoring profile', () => {
    beforeEach(() => {
      process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
      process.env.DHSC_AI_SEARCH_INDEX_NAME = 'test-index';
      process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';
      process.env.DHSC_AI_SEARCH_SCORING_PROFILE = 'test-scoring-profile';
      EnvironmentContext.reset();

      (AzureKeyCredential as jest.Mock).mockImplementation(() => ({
        key: 'test-api-key',
      }));
    });

    it('should call search client with parameters including the scoring profile', async () => {
      const searchTerm = 'test-search';
      const mockSearch = jest.fn();

      (SearchClient as jest.Mock).mockImplementation(() => ({
        search: mockSearch,
      }));

      mockSearch.mockResolvedValue({ results: [] });

      const searchService = new SearchService();
      await searchService.searchWith(searchTerm);

      expect(SearchClient).toHaveBeenCalledWith(
        'test-url',
        'test-index',
        expect.any(Object)
      );

      expect(mockSearch).toHaveBeenCalledWith(
        getExpectedSearchTerm(searchTerm),
        expect.objectContaining({ scoringProfile: 'test-scoring-profile' })
      );
    });
  });
});

function getExpectedSearchTerm(searchTerm: string): string {
  return `${searchTerm} /.*${searchTerm}.*/`;
}
