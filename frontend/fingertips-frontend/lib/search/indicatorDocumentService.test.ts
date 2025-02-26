import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { SearchServiceFactory } from './searchServiceFactory';
import { INDICATOR_SEARCH_INDEX_NAME } from './searchTypes';
import { IndicatorDocumentService } from './indicatorDocumentService';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('IndicatorDocumentService', () => {
  const mockGetDocument = jest.fn();

  (SearchClient as jest.Mock).mockImplementation(() => ({
    getDocument: mockGetDocument,
  }));

  mockGetDocument.mockResolvedValue(undefined);

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
      const searchService = SearchServiceFactory.getIndicatorDocumentService();
      expect(searchService).toBeInstanceOf(IndicatorDocumentService);
    });

    it('should call search client with correct parameter', async () => {
      const indicatorId = '123';

      const searchService = SearchServiceFactory.getIndicatorDocumentService();
      await searchService.getIndicator(indicatorId);

      expect(SearchClient).toHaveBeenCalledWith(
        'test-url',
        INDICATOR_SEARCH_INDEX_NAME,
        expect.any(Object)
      );

      expect(mockGetDocument).toHaveBeenCalledWith(indicatorId);
    });

    it('should return a document', async () => {
      const mockResult = {
        indicatorId: '123',
        name: 'Test Indicator',
        latestDataPeriod: undefined,
        dataSource: 'Test Source',
        lastUpdated: '2024-01-01',
      };

      mockGetDocument.mockResolvedValue(mockResult);

      const searchService = SearchServiceFactory.getIndicatorDocumentService();
      const result = await searchService.getIndicator('123');

      expect(result).toEqual({
        indicatorId: '123',
        name: 'Test Indicator',
        latestDataPeriod: undefined,
        dataSource: 'Test Source',
        lastUpdated: '2024-01-01',
      });
    });
  });
});
