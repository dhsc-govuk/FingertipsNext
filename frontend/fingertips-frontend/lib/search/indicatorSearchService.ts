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

    // This creates an AI Search filter string which should look like
    //  associatedAreaCodes/any(a: a eq 'E09000023' or a eq 'E09000013' or a eq 'E09000025')
    const formatFilterString = (areaCodes: string[]) => {
      if (areaCodes.length == 0) return undefined;
      const areaCodeEqualityStrings = areaCodes.map((a) => `a eq '${a}'`);
      return `associatedAreaCodes/any(a: ${areaCodeEqualityStrings.join(' or ')})`;
    };

    const searchOptions: SearchOptions<IndicatorDocument> = {
      queryType: 'full',
      includeTotalCount: true,
      top: 100,
      filter: areaCodes ? formatFilterString(areaCodes) : undefined,
    };

    const searchResponse = await this.searchClient.search(query, searchOptions);
    const results: IndicatorDocument[] = [];

    for await (const result of searchResponse.results) {
      results.push(result.document as IndicatorDocument);
    }

    return results;
  }
}
