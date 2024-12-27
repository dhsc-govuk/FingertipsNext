import { SearchService } from "./searchService";
//import { AzureKeyCredential, SearchClient } from '@azure/search-documents';

describe('Search-service', () => {
  describe('if the environment is not configured', () => {
      it('should throw an error on attempting to instantiate the service', () => {
        expect(() => { new SearchService() }).toThrow(Error);
      });
    });

  describe('if the environment is configured', () => {
    process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
    process.env.DHSC_AI_SEARCH_INDEX_NAME = 'test-index';
    process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';

    jest.mock('@azure/search-documents', () => ({
      SearchClient: jest.fn().mockImplementation(() => ({
        default: jest.fn().mockImplementation(() => {
          console.log('Search client construtor');
        })
      })),
      // default: jest.fn().mockImplementation(() => {
        
      // })
      AzureKeyCredential: jest.fn().mockImplementation(() => ({
        default: jest.fn().mockImplementation(() => {
          console.log('Credential construtor');
        })
      }))
    }));


    it('should return the value of the environment variable', () => {
      const searchService = new SearchService();
      searchService.searchWith('test-search');
    });
  });

});