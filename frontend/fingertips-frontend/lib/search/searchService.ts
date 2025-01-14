import { Search, IndicatorSearchResult } from './searchResultData';
import {
  AzureKeyCredential,
  SearchClient,
  SearchOptions,
} from '@azure/search-documents';
import {
  DHSC_AI_SEARCH_SERVICE_URL,
  DHSC_AI_SEARCH_INDEX_NAME,
  DHSC_AI_SEARCH_API_KEY,
  DHSC_AI_SEARCH_SCORING_PROFILE,
  EnvironmentContext,
} from '../environmentContext';

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
  readonly searchClient: SearchClient<Indicator>;

  constructor() {
    this.searchClient = new SearchClient<Indicator>(
      EnvironmentContext.getEnvironmentMap().get(
        DHSC_AI_SEARCH_SERVICE_URL
      ) as string,
      EnvironmentContext.getEnvironmentMap().get(
        DHSC_AI_SEARCH_INDEX_NAME
      ) as string,
      new AzureKeyCredential(
        EnvironmentContext.getEnvironmentMap().get(
          DHSC_AI_SEARCH_API_KEY
        ) as string
      )
    );
  }

  async searchWith(searchTerm: string): Promise<IndicatorSearchResult[]> {
    // Search with both full search term and wildcard for now to allow for
    // observed behaviour where wildcard match of full term did not always return
    // the matching document.
    const query = `${searchTerm} /.*${searchTerm}.*/`;

    const searchOptions: SearchOptions<Indicator> = {
      queryType: 'full',
      includeTotalCount: true,
    };

    const scoringProfile = EnvironmentContext.getEnvironmentMap().get(
      DHSC_AI_SEARCH_SCORING_PROFILE
    );
    if (scoringProfile) {
      searchOptions.scoringProfile = scoringProfile;
    }

    const searchResponse = await this.searchClient.search(query, searchOptions);

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
