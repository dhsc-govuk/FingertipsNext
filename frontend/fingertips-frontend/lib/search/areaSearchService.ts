import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  AreaDocument,
  highlightTag,
  IAreaSearchService,
  SuggestionResult,
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
  ): Promise<SuggestionResult[]> {
    const suggestions = await this.searchClient.suggest(
      partialAreaName,
      AREA_SEARCH_SUGGESTER_NAME,
      {
        searchFields: ['areaCode', 'areaName', 'postcode'],
        select: ['areaCode', 'areaType', 'areaName', 'postcode'],
        useFuzzyMatching: false,
        top: 20,
        highlightPreTag: highlightTag,
        highlightPostTag: highlightTag,
      }
    );
    const areaDocs = suggestions.results.map((suggestion) => {
      return {
        text: suggestion.text,
        document: suggestion.document as AreaDocument,
      };
    });

    return areaDocs;
  }

  public async getAreaDocument(
    areaCode: string
  ): Promise<AreaDocument | undefined> {
    return this.searchClient.getDocument(areaCode);
  }
}
