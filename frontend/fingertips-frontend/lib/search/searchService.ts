import { IndicatorSearch, IndicatorSearchResult } from './searchResultData';
import { AzureKeyCredential, SearchClient } from '@azure/search-documents';

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

const getEnvironmentVariable = (name: string): string => {
  return (
    process.env[name] ??
    (() => {
      throw new Error(`Missing environment variable ${name}`);
    })()
  );
};

export class SearchService implements IndicatorSearch {
  readonly searchClient: SearchClient<Indicator>;

  constructor() {
    const serviceName = getEnvironmentVariable('DHSC_AI_SEARCH_SERVICE_NAME');
    const indexName = getEnvironmentVariable('DHSC_AI_SEARCH_INDEX_NAME');
    const apiKey = getEnvironmentVariable('DHSC_AI_SEARCH_API_KEY');

    this.searchClient = new SearchClient<Indicator>(
      `https://${serviceName}.search.windows.net`,
      indexName,
      new AzureKeyCredential(apiKey)
    );
  }

  async searchByIndicator(indicator: string): Promise<IndicatorSearchResult[]> {
    const query = `/.*${indicator}.*/`;

    const searchResponse = await this.searchClient.search(query, {
      queryType: 'full',
      searchFields: ['IID'],
      includeTotalCount: true,
    });

    const results: IndicatorSearchResult[] = [];
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
