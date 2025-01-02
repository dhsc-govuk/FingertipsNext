import { SearchService } from './searchService';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.DHSC_AI_SEARCH_SERVICE_URL;
    delete process.env.DHSC_AI_SEARCH_INDEX_NAME;
    delete process.env.DHSC_AI_SEARCH_API_KEY;
  });

  describe('if the environment is not configured it', () => {
    it('should throw an error on attempting to instantiate the service', () => {
      expect(() => {
        new SearchService();
      }).toThrow(Error);
    });
  });

  describe('if the environment is configured it', () => {
    beforeEach(() => {
      process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
      process.env.DHSC_AI_SEARCH_INDEX_NAME = 'test-index';
      process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';

      (SearchClient as jest.Mock).mockImplementation(() => ({
        search: jest.fn().mockResolvedValue({
          results: [],
        }),
      }));

      (AzureKeyCredential as jest.Mock).mockImplementation(() => ({
        key: 'test-api-key',
      }));
    });

    it('should successfully create a search service instance', () => {
      const searchService = new SearchService();
      expect(searchService).toBeInstanceOf(SearchService);
    });

    it('should call search client with correct parameters', async () => {
      const searchService = new SearchService();
      await searchService.searchWith('test-search');

      expect(SearchClient).toHaveBeenCalledWith(
        'test-url',
        'test-index',
        expect.any(Object)
      );
    });

    it('should perform a search operation', async () => {
      const mockSearchResults = {
        latestDataPeriod: undefined,
        results: [
          {
            document: {
              IID: '123',
              Descriptive: {
                Name: 'Test Indicator',
                DataSource: 'Test Source',
              },
              DataChange: {
                LastUploadedAt: '2024-01-01',
              },
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
          id: '123',
          indicatorName: 'Test Indicator',
          latestDataPeriod: undefined,
          dataSource: 'Test Source',
          lastUpdated: '2024-01-01',
        },
      ]);
    });
  });
});
