import { SearchClient } from '@azure/search-documents';
import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
} from './searchTypes';
import { AreaSearchService } from './areaSearchService';

jest.mock('@azure/search-documents', () => ({
  SearchClient: jest.fn(),
  AzureKeyCredential: jest.fn(),
}));

describe('AreaSearchService', () => {
  const mockSearch = jest.fn();
  let searchService: AreaSearchService;

  (SearchClient as jest.Mock).mockImplementation(() => ({
    suggest: mockSearch,
    getDocument: jest.fn().mockResolvedValue({
      areaCode: '123',
      areaType: 'Town',
      areaName: 'Solihull',
    }),
  }));

  mockSearch.mockResolvedValue({ results: [] });

  beforeEach(() => {
    searchService = new AreaSearchService('someUrl', 'someKey', AREA_SEARCH_INDEX_NAME);
  })

  describe('if the environment is configured it', () => {
    it('should successfully create a search service instance', () => {
      expect(SearchClient).toHaveBeenCalledWith(
        'someUrl',
        AREA_SEARCH_INDEX_NAME,
        expect.any(Object)
      );
    });

    it('should call search client with correct parameters', async () => {
      const SEARCH_TERM = 'someText';
      await searchService.getAreaSuggestions(SEARCH_TERM);

      expect(mockSearch).toHaveBeenLastCalledWith(
        SEARCH_TERM,
        AREA_SEARCH_SUGGESTER_NAME,
        {
          searchFields: ['areaCode', 'areaName'],
          select: ['areaCode', 'areaType', 'areaName'],
          top: 20,
          useFuzzyMatching: true,
        }
      );
    });

    it('should perform a search operation', async () => {
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

      mockSearch.mockResolvedValue(mockSearchResults);
      const results =
        await searchService.getAreaSuggestions('random search text');

      expect(results).toEqual([
        {
          areaCode: '123',
          areaType: 'Town',
          areaName: 'Solihull',
        },
        {
          areaCode: '234',
          areaType: 'City',
          areaName: 'Leeds',
        },
        {
          areaCode: '345',
          areaType: 'Mega City',
          areaName: 'London',
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
