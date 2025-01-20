import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import {
  AreaDocument,
  IAreaSearchClient as IAreaSearchService,
} from './searchTypes';

export class AreaSearchService implements IAreaSearchService {
  public static getInstance(_url?: string): AreaSearchService {
    if (!AreaSearchService.#instance) {
      const url = _url || process.env.DHSC_AI_SEARCH_SERVICE_URL || 'null';
      const apiKey = process.env.DHSC_AI_SEARCH_API_KEY || 'null';
      AreaSearchService.#instance = new AreaSearchService(
        url,
        new AzureKeyCredential(apiKey)
      );
    }
    return AreaSearchService.#instance;
  }

  static #instance: AreaSearchService;
  private searchClient: SearchClient<AreaDocument>;

  private constructor(url: string, credentials: AzureKeyCredential) {
    const indexName = 'geography-search-index';
    this.searchClient = new SearchClient<AreaDocument>(
      url,
      indexName,
      credentials
    );
  }

  public async getAreaSuggestions(
    partialAreaName: string
  ): Promise<AreaDocument[]> {
    console.log('AreaSearchService::getAreaSuggestions');

    const suggestions = await this.searchClient.suggest(
      partialAreaName,
      'geographySuggester',
      {
        searchFields: ['areaCode', 'areaName'],
        select: ['areaCode', 'areaType', 'areaName'],
        useFuzzyMatching: true,
      }
    );
    const areaDocs = suggestions.results.map((suggestion) => {
      return suggestion.document as AreaDocument;
    });

    return areaDocs;
  }
}
