import { IndicatorSearchService } from './indicatorSearchService';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { SearchServiceFactory } from './searchServiceFactory';
import { INDICATOR_SEARCH_INDEX_NAME } from './searchTypes';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('IndicatorSearchService', () => {
  const mockSearch = jest.fn();
  const mockGetDocument = jest.fn();

  (SearchClient as jest.Mock).mockImplementation(() => ({
    search: mockSearch,
    getDocument: mockGetDocument,
  }));

  mockSearch.mockResolvedValue({ results: [] });
  mockGetDocument.mockResolvedValue({
    indicatorID: '123',
    indicatorName: 'Test Indicator',
    indicatorDefinition: 'Test definition',
    latestDataPeriod: undefined,
    earliestDataPeriod: '1938',
    dataSource: 'Test Source',
    lastUpdatedDate: new Date('November 5, 2023'),
    associatedAreaCodes: ['Area1', 'Area2'],
    trendsByArea: [
      {
        areaCode: 'Area1',
        trend: HealthDataPointTrendEnum.Decreasing,
      },
      {
        areaCode: 'Area2',
        trend: HealthDataPointTrendEnum.NoSignificantChange,
      },
    ],
    unitLabel: '',
    hasInequalities: true,
    usedInPoc: true,
  });

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
      await searchService.searchWith(searchTerm, false);

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

    it('should call search client with correct parameters for single area search', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, ['Area1']);

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
          filter: "associatedAreaCodes/any(a: a eq 'Area1')",
        })
      );
    });

    it('should call search client with correct parameters for multiple area search', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, [
        'Area1',
        'Area2',
        'Area3',
      ]);

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
          filter:
            "associatedAreaCodes/any(a: a eq 'Area1' or a eq 'Area2' or a eq 'Area3')",
        })
      );
    });

    it('should call search client with correct parameters for empty area array', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, []);

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
          filter: undefined,
        })
      );
    });

    it('should perform a search operation', async () => {
      const mockSearchResults = {
        latestDataPeriod: undefined,
        results: [
          {
            document: {
              indicatorID: '123',
              indicatorName: 'Test Indicator',
              indicatorDefinition: 'Test definition',
              latestDataPeriod: undefined,
              earliestDataPeriod: '1938',
              dataSource: 'Test Source',
              lastUpdatedDate: new Date('November 5, 2023'),
              associatedAreaCodes: ['Area1', 'Area2'],
              trendsByArea: [
                {
                  areaCode: 'Area1',
                  trend: HealthDataPointTrendEnum.Decreasing,
                },
                {
                  areaCode: 'Area2',
                  trend: HealthDataPointTrendEnum.NoSignificantChange,
                },
              ],
              unitLabel: '',
              hasInequalities: true,
              usedInPoc: true,
            },
          },
        ],
      };

      mockSearch.mockResolvedValue(mockSearchResults);

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      const results = await searchService.searchWith('Test Indicator', false);

      expect(results).toEqual([
        {
          indicatorID: '123',
          indicatorName: 'Test Indicator',
          indicatorDefinition: 'Test definition',
          latestDataPeriod: undefined,
          earliestDataPeriod: '1938',
          dataSource: 'Test Source',
          lastUpdatedDate: new Date('November 5, 2023'),
          trend: undefined,
          unitLabel: '',
          hasInequalities: true,
        },
      ]);
    });

    it('should only return the first 20 results', async () => {
      const fiftyResults = Array(50).fill({
        document: {
          indicatorID: '123',
          indicatorName: 'Test Indicator',
          indicatorDefinition: 'Test definition',
          latestDataPeriod: undefined,
          earliestDataPeriod: '1938',
          dataSource: 'Test Source',
          lastUpdatedDate: new Date('November 5, 2023'),
          associatedAreaCodes: ['Area1', 'Area2'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.Decreasing,
            },
            {
              areaCode: 'Area2',
              trend: HealthDataPointTrendEnum.NoSignificantChange,
            },
          ],
          unitLabel: '',
          hasInequalities: true,
          usedInPoc: true,
        },
      });

      const mockSearchResults = {
        latestDataPeriod: undefined,
        results: fiftyResults,
      };

      mockSearch.mockResolvedValue(mockSearchResults);

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      const results = await searchService.searchWith('Test Indicator', false);

      expect(results).toHaveLength(20);
    });
  });

  it('should get a single indicator document', async () => {
    const indicatorId = '123';

    const searchService = SearchServiceFactory.getIndicatorSearchService();
    const result = await searchService.getIndicator(indicatorId);

    expect(SearchClient).toHaveBeenCalledWith(
      'test-url',
      INDICATOR_SEARCH_INDEX_NAME,
      expect.any(Object)
    );

    expect(result).toEqual({
      indicatorID: '123',
      indicatorName: 'Test Indicator',
      indicatorDefinition: 'Test definition',
      latestDataPeriod: undefined,
      earliestDataPeriod: '1938',
      dataSource: 'Test Source',
      lastUpdatedDate: new Date('November 5, 2023'),
      trend: undefined,
      unitLabel: '',
      hasInequalities: true,
    });
  });

  it('should return undefined if getDocument throws an error', async () => {
    mockGetDocument.mockImplementation(async () => {
      throw new Error('some error');
    });

    const searchService = SearchServiceFactory.getIndicatorSearchService();
    const result = await searchService.getIndicator('123');

    expect(result).toBeUndefined();
  });
});

function getExpectedSearchTerm(searchTerm: string): string {
  return `${searchTerm} /.*${searchTerm}.*/`;
}
