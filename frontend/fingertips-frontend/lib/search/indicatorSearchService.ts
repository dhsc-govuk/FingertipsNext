import {
  AzureKeyCredential,
  SearchClient,
  SearchOptions,
} from '@azure/search-documents';

import {
  IIndicatorSearchService,
  INDICATOR_SEARCH_INDEX_NAME,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';
import { IndicatorMapper } from './indicatorMapper';

export class IndicatorSearchService implements IIndicatorSearchService {
  private readonly searchClient: SearchClient<RawIndicatorDocument>;
  private readonly mapper: IndicatorMapper;

  constructor(fingertipsAzureAiSearchUrl: string, apiKey: string) {
    const indexName = INDICATOR_SEARCH_INDEX_NAME;
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
    // If the search is entirely numeric, we prioritise searcing for the exact id in the indicator id field,
    // but include a wildcard search as some indicator titles include numbers (ie '65').
    //
    // If the search is not numeric, we prioritise matching the full term against the indicator name
    // and allow fuzzy matching against each word in the search term
    const buildIndicatorIdSearchString = (searchTerm: string): string => {
      return `indicatorID:${searchTerm}^2 ${searchTerm}`;
    };

    const buildTextSearchString = (searchTerm: string): string => {
      const fuzzySearchTerms = searchTerm
        .split(/\s+/)
        .map((subString) => {
          return subString.length > 5 ? `${subString}~` : subString;
        })
        .join(' ')
        .trim();
      return `indicatorName:"${searchTerm}"^2 ${fuzzySearchTerms}`;
    };

    const isPossibleIndicatorId = !isNaN(Number(searchTerm));
    const query = isPossibleIndicatorId
      ? buildIndicatorIdSearchString(searchTerm)
      : buildTextSearchString(searchTerm);

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
      results,
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
      console.error(
        `error getting single indicator from ai search: ${(<Error>e).message}`
      );
      return undefined;
    }

    return this.mapper.toEntity(rawIndicatorDocument, [], false);
  }
}
