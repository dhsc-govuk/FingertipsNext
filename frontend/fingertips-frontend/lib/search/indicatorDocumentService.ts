import { AzureKeyCredential, SearchClient } from '@azure/search-documents';

import {
  IIndicatorDocumentService,
  INDICATOR_SEARCH_INDEX_NAME,
  IndicatorDocument,
} from './searchTypes';

export class IndicatorDocumentService implements IIndicatorDocumentService {
  readonly searchClient: SearchClient<IndicatorDocument>;

  constructor(fingertipsAzureAiSearchUrl: string, apiKey: string) {
    const indexName = INDICATOR_SEARCH_INDEX_NAME;
    const credentials = new AzureKeyCredential(apiKey);

    this.searchClient = new SearchClient<IndicatorDocument>(
      fingertipsAzureAiSearchUrl,
      indexName,
      credentials
    );
  }

  async getIndicator(indicatorId: string): Promise<IndicatorDocument> {
    return this.searchClient.getDocument(indicatorId);
  }
}
