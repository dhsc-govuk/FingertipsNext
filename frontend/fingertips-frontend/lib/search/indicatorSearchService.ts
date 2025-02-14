import {
  AzureKeyCredential,
  SearchClient,
  SearchOptions,
} from '@azure/search-documents';

import {
  IIndicatorSearchService,
  INDICATOR_SEARCH_INDEX_NAME,
  IndicatorDocument,
} from './searchTypes';

export class IndicatorSearchService implements IIndicatorSearchService {
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

  async searchWith(
    searchTerm: string,
    areaCodes?: string[]
  ): Promise<IndicatorDocument[]> {
    // Search with both full search term and wildcard for now to allow for
    // observed behaviour where wildcard match of full term did not always return
    // the matching document.
    const query = `${searchTerm} /.*${searchTerm}.*/`;

    const searchOptions: SearchOptions<IndicatorDocument> = {
      queryType: 'full',
      includeTotalCount: true,
      top: 100,
      filter: areaCodes
        ? `associatedAreaCodes/any(a: ${areaCodes.map((a) => `a eq '${a}'`).join(' or ')})`
        : undefined,
    };

    const searchResponse = await this.searchClient.search(query, searchOptions);
    const results: IndicatorDocument[] = [];

    console.log(JSON.stringify(searchResponse));
    for await (const result of searchResponse.results) {
      results.push(result.document as IndicatorDocument);
    }

    return results;
  }
}
