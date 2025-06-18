import {
  INDICATOR_SEARCH_MAX_CHARACTERS,
  IndicatorSearchService,
} from './indicatorSearchService';
import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import { SearchServiceFactory } from './searchServiceFactory';
import { INDICATOR_SEARCH_INDEX_NAME } from './searchTypes';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';
import { escapeString } from '../escapeString';

vi.mock('@azure/search-documents', () => ({
  SearchClient: vi.fn(),
  AzureKeyCredential: vi.fn(),
}));

describe('IndicatorSearchService', () => {
  const mockSearch = vi.fn();
  const mockGetDocument = vi.fn();

  (SearchClient as Mock).mockImplementation(() => ({
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

      (AzureKeyCredential as Mock).mockImplementation(() => ({
        key: 'test-api-key',
      }));

      mockSearch.mockClear();
      mockGetDocument.mockClear();
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
        getExpectedSingleWordSearchTerm(searchTerm),
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
        })
      );
    });

    it('should search with fuzziness applied to words greater than 5', async () => {
      const searchTerm = 'test search with multiple words';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false);

      expect(mockSearch).toHaveBeenLastCalledWith(
        '"test search with multiple words"^2 test search~1 with multiple~1 words',
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
        })
      );
    });

    it('should search with correct parameters for a numeric search term', async () => {
      const searchTerm = '1234';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false);

      expect(mockSearch).toHaveBeenLastCalledWith(
        searchTerm,
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
        })
      );
    });

    it('should trim search terms of over 200 characters and report an error', async () => {
      const searchTerm = '1'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS + 1);

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false);

      expect(mockSearch).toHaveBeenLastCalledWith(
        '1'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS),
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
        })
      );
    });

    it('should search with correct parameters for single area search', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, ['Area1']);

      expect(mockSearch).toHaveBeenLastCalledWith(
        getExpectedSingleWordSearchTerm(searchTerm),
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
          filter: "associatedAreaCodes/any(a: a eq 'Area1')",
        })
      );
    });

    it('should search with correct parameters for multiple area search', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, [
        'Area1',
        'Area2',
        'Area3',
      ]);

      expect(mockSearch).toHaveBeenLastCalledWith(
        getExpectedSingleWordSearchTerm(searchTerm),
        expect.objectContaining({
          queryType: 'full',
          includeTotalCount: true,
          filter:
            "associatedAreaCodes/any(a: a eq 'Area1' or a eq 'Area2' or a eq 'Area3')",
        })
      );
    });

    it('should search with correct parameters for empty area array', async () => {
      const searchTerm = 'test-search';

      const searchService = SearchServiceFactory.getIndicatorSearchService();
      await searchService.searchWith(searchTerm, false, []);

      expect(mockSearch).toHaveBeenLastCalledWith(
        getExpectedSingleWordSearchTerm(searchTerm),
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

    it('should only return all results', async () => {
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

      expect(results).toHaveLength(50);
    });
  });

  it('should get a single indicator document', async () => {
    const indicatorId = '123';

    const searchService = SearchServiceFactory.getIndicatorSearchService();
    const result = await searchService.getIndicator(indicatorId);

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
    const spyLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    const searchService = SearchServiceFactory.getIndicatorSearchService();
    const result = await searchService.getIndicator('123');

    expect(result).toBeUndefined();
    expect(spyLog).toHaveBeenCalled();
  });
});

function getExpectedSingleWordSearchTerm(searchTerm: string): string {
  const term = escapeString(searchTerm);
  return `"${term}"^2 ${term}~1`;
}
