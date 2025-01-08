import { Search, IndicatorSearchResult } from './searchResultData';
import {
  AzureKeyCredential,
  SearchClient,
  SearchOptions,
} from '@azure/search-documents';
import { getEnvironmentVariable } from '../utils';

type Indicator = {
  IID: string;
  Descriptive: {
    Name: string;
    Definition: string;
    DataSource: string;
  };
  LatestDataPeriod: string;
  DataChange: {
    LastUploadedAt: string;
  };
};

export class SearchService implements Search {
  readonly serviceUrl: string;
  readonly indexName: string;
  readonly apiKey: string;

  constructor() {
    this.serviceUrl = getEnvironmentVariable(
      'DHSC_AI_SEARCH_SERVICE_URL'
    ) as string;
    this.indexName = getEnvironmentVariable(
      'DHSC_AI_SEARCH_INDEX_NAME'
    ) as string;
    this.apiKey = getEnvironmentVariable('DHSC_AI_SEARCH_API_KEY') as string;
  }

  async searchWith(searchTerm: string): Promise<IndicatorSearchResult[]> {
    const query = `${searchTerm} /.*${searchTerm}.*/`;

    const searchClient = new SearchClient<Indicator>(
      this.serviceUrl,
      this.indexName,
      new AzureKeyCredential(this.apiKey)
    );

    const searchOptions: SearchOptions<Indicator> = {
      queryType: 'full',
      includeTotalCount: true,
    };

    const scoringProfile = getEnvironmentVariable(
      'DHSC_AI_SEARCH_SCORING_PROFILE',
      false
    );
    if (scoringProfile) {
      searchOptions.scoringProfile = scoringProfile;
    }

    const searchResponse = await searchClient.search(query, searchOptions);

    const results: IndicatorSearchResult[] = [];
    for await (const result of searchResponse.results) {
      results.push({
        id: result?.document?.IID,
        indicatorName: result?.document?.Descriptive?.Name,
        latestDataPeriod: result?.document?.LatestDataPeriod,
        dataSource: result.document?.Descriptive?.DataSource,
        lastUpdated: result.document?.DataChange?.LastUploadedAt,
      });
    }

    return results;
  }
}
