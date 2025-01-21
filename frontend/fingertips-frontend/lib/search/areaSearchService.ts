import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  AreaDocument,
  IAreaSearchService,
} from './searchTypes';

export class AreaSearchService implements IAreaSearchService {
  public static getInstance(): AreaSearchService {
    if (!AreaSearchService.#instance) {
      throw new Error('Instance does not exist');
    }
    return AreaSearchService.#instance;
  }

  static #instance: AreaSearchService;
  private searchClient: SearchClient<AreaDocument>;

  constructor(url: string, apiKey: string) {
    const indexName = AREA_SEARCH_INDEX_NAME;
    const credentials = new AzureKeyCredential(apiKey);

    this.searchClient = new SearchClient<AreaDocument>(
      url,
      indexName,
      credentials
    );
  }

  public async getAreaSuggestions(
    partialAreaName: string
  ): Promise<AreaDocument[]> {
    const suggestions = await this.searchClient.suggest(
      partialAreaName,
      AREA_SEARCH_SUGGESTER_NAME,
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
