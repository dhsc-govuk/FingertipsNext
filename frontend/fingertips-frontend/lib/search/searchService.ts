import { Search, BasicSearchResult } from './searchResultData';
import { AzureKeyCredential, SearchClient } from '@azure/search-documents';
import { getEnvironmentVariable } from '../utils';

type Indicator = {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
    DataSource: string;
  };
  DataChange: {
    LastUploadedAt: string;
  };
};

export class SearchService implements Search {
  readonly serviceUrl: string;
  readonly indexName: string;
  readonly apiKey: string;

  constructor() {
    this.serviceUrl = getEnvironmentVariable('DHSC_AI_SEARCH_SERVICE_URL');
    this.indexName = getEnvironmentVariable('DHSC_AI_SEARCH_INDEX_NAME');
    this.apiKey = getEnvironmentVariable('DHSC_AI_SEARCH_API_KEY');
  }

  async searchWith(searchTerm: string): Promise<BasicSearchResult[]> {
    const query = `${searchTerm} /.*${searchTerm}.*/`;

    const searchClient = new SearchClient<Indicator>(
      this.serviceUrl,
      this.indexName,
      new AzureKeyCredential(this.apiKey)
    );

    const searchResponse = await searchClient.search(query, {
      queryType: 'full',
      includeTotalCount: true,
    });

    const results: BasicSearchResult[] = [];
    for await (const result of searchResponse.results) {
      results.push({
        id: result?.document?.IID,
        indicatorName: result?.document?.Descriptive?.Name,
        latestDataPeriod: undefined,
        dataSource: result.document?.Descriptive?.DataSource,
        lastUpdated: result.document?.DataChange?.LastUploadedAt,
      });
    }

    return results;
  }
}
