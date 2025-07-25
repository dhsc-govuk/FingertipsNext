import { SearchClient } from '@azure/search-documents';
import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  highlightTag,
} from './searchTypes';
import { AreaSearchService } from './areaSearchService';
import { Mock } from 'vitest';

vi.mock('@azure/search-documents', () => ({
  SearchClient: vi.fn(),
  AzureKeyCredential: vi.fn(),
}));

describe('AreaSearchService', () => {
  const mockSearch = vi.fn();

  (SearchClient as Mock).mockImplementation(() => ({
    suggest: mockSearch,
    getDocument: vi.fn().mockResolvedValue({
      areaCode: '123',
      areaType: 'Town',
      areaName: 'Solihull',
    }),
  }));

  mockSearch.mockResolvedValue({ results: [] });

  describe('if the environment is configured it', () => {
    it('should successfully create a search service instance', () => {
      const searchService = new AreaSearchService('someUrl', 'someKey');
      expect(searchService).toBeInstanceOf(AreaSearchService);
      expect(SearchClient).toHaveBeenCalledWith(
        'someUrl',
        AREA_SEARCH_INDEX_NAME,
        expect.any(Object)
      );
    });

    it('should call search client with correct parameters', async () => {
      const SEARCH_TERM = 'someText';
      const searchService = new AreaSearchService('someUrl', 'someKey');
      await searchService.getAreaSuggestions(SEARCH_TERM);

      expect(mockSearch).toHaveBeenLastCalledWith(
        SEARCH_TERM,
        AREA_SEARCH_SUGGESTER_NAME,
        {
          searchFields: ['areaCode', 'areaName', 'postcode'],
          select: ['areaCode', 'areaType', 'areaName', 'postcode'],
          top: 20,
          useFuzzyMatching: false,
          highlightPreTag: highlightTag,
          highlightPostTag: highlightTag,
        }
      );
    });

    it('should perform a search operation', async () => {
      const mockSearchResults = {
        results: [
          {
            text: '*York*',
            document: {
              areaCode: '123',
              areaType: 'City',
              areaName: 'York',
            },
          },
          {
            text: 'North *York*shire',
            document: {
              areaCode: '234',
              areaType: 'Town',
              areaName: 'North Yorkshire',
            },
          },
          {
            text: 'South *York*shire',
            document: {
              areaCode: '345',
              areaType: 'Town',
              areaName: 'South Yorkshire',
            },
          },
        ],
      };

      mockSearch.mockResolvedValue(mockSearchResults);

      const searchService = new AreaSearchService('someUrl', 'someKey');
      const results = await searchService.getAreaSuggestions('york');

      expect(results).toEqual([
        {
          text: '*York*',
          document: {
            areaCode: '123',
            areaType: 'City',
            areaName: 'York',
          },
        },
        {
          text: 'North *York*shire',
          document: {
            areaCode: '234',
            areaType: 'Town',
            areaName: 'North Yorkshire',
          },
        },
        {
          text: 'South *York*shire',
          document: {
            areaCode: '345',
            areaType: 'Town',
            areaName: 'South Yorkshire',
          },
        },
      ]);
    });

    it('test that when getAreaDocument is called an area is returned', async () => {
      const mockSearchResults = {
        results: [
          {
            document: {
              areaCode: '123',
              areaType: 'Town',
              areaName: 'Solihull',
            },
          },
          {
            document: {
              areaCode: '234',
              areaType: 'City',
              areaName: 'Leeds',
            },
          },
          {
            document: {
              areaCode: '345',
              areaType: 'Mega City',
              areaName: 'London',
            },
          },
        ],
      };

      mockSearch.mockReset();
      mockSearch.mockResolvedValue(mockSearchResults);

      const searchService = new AreaSearchService('someUrl', 'someKey');
      const areaDocument = await searchService.getAreaDocument('123');
      expect(areaDocument).toBeDefined();
      expect(areaDocument).toEqual({
        areaCode: '123',
        areaType: 'Town',
        areaName: 'Solihull',
      });
    });
  });
});
