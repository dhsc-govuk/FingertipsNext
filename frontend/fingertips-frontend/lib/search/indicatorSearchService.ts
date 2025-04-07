import {
  AzureKeyCredential,
  SearchClient,
  SearchOptions,
} from '@azure/search-documents';

import {
  IIndicatorSearchService,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';
import { IndicatorMapper } from './indicatorMapper';

export class IndicatorSearchService implements IIndicatorSearchService {
  private readonly searchClient: SearchClient<RawIndicatorDocument>;
  private readonly mapper: IndicatorMapper;

  constructor(
    fingertipsAzureAiSearchUrl: string,
    apiKey: string,
    indexName: string
  ) {
    const credentials = new AzureKeyCredential(apiKey);

    this.searchClient = new SearchClient<RawIndicatorDocument>(
      fingertipsAzureAiSearchUrl,
      indexName,
      credentials
    );
    this.mapper = new IndicatorMapper();
  }

  async searchWith(
    searchTerm: string,
    isEnglandSelectedAsGroup: boolean,
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

    const searchOptions: SearchOptions<RawIndicatorDocument> = {
      queryType: 'full',
      includeTotalCount: true,
      top: 100,
      filter: areaCodes ? formatFilterString(areaCodes) : undefined,
    };

    const searchResponse = await this.searchClient.search(query, searchOptions);
    const results: RawIndicatorDocument[] = [];

    for await (const result of searchResponse.results) {
      results.push(result.document as RawIndicatorDocument);
    }

    return this.mapper.toEntities(
      results.slice(0, 20),
      areaCodes ?? [],
      isEnglandSelectedAsGroup
    );
  }

  async getIndicator(
    indicatorId: string
  ): Promise<IndicatorDocument | undefined> {
    let rawIndicatorDocument: RawIndicatorDocument;
    try {
      rawIndicatorDocument = (await this.searchClient.getDocument(
        indicatorId
      )) as RawIndicatorDocument;
    } catch (e) {
      console.log(
        `Error occurred getting indicator from search. Error message: ${(<Error>e).message}`
      );
      return undefined;
    }

    return this.mapper.toEntity(rawIndicatorDocument, [], false);
  }
}
