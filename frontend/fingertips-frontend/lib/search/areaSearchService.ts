import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  AreaDocument,
  IAreaSearchService,
} from './searchTypes';

export class AreaSearchService implements IAreaSearchService {
  private readonly searchClient: SearchClient<AreaDocument>;

  constructor(fingertipsAzureAiSearchUrl: string, apiKey: string) {
    const indexName = AREA_SEARCH_INDEX_NAME;
    const credentials = new AzureKeyCredential(apiKey);

    this.searchClient = new SearchClient<AreaDocument>(
      fingertipsAzureAiSearchUrl,
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
        top: 20,
      }
    );
    const areaDocs = suggestions.results.map((suggestion) => {
      return suggestion.document as AreaDocument;
    });

    return areaDocs;
  }

  public async getAreaDocument(
    areaCode: string
  ): Promise<AreaDocument | undefined> {
    return this.searchClient.getDocument(areaCode);
  }
}
