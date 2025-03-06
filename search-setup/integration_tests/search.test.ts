import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  INDICATOR_SEARCH_INDEX_NAME,
} from '../src/constants';
import {
  AutoCompleteResult,
  SearchIndexResponse,
  SuggestionResult,
  TypeAheadBody,
} from '../src/types';

let index: SearchIndexResponse;
let searchEndpoint: string;
let apiKey: string;
let urlPrefix: string;
const URL_SUFFIX = '?api-version=2024-07-01';

const ONS_AREA_CODE_ENGLAND = 'E92000001';

//  associatedAreaCodes/any(a: a eq 'E09000023' or a eq 'E09000013' or a eq 'E09000025')
function formatFilterString(areaCodes: string[]) {
  if (areaCodes.length == 0) return undefined;
  const areaCodeEqualityStrings = areaCodes.map((a) => `a eq '${a}'`);
  return `associatedAreaCodes/any(a: ${areaCodeEqualityStrings.join(' or ')})`;
}

describe('AI search index creation and data loading', () => {
  searchEndpoint = process.env.AI_SEARCH_SERVICE_ENDPOINT!;
  apiKey = process.env.AI_SEARCH_API_KEY!;

  const expectIndexToBePopulated = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'api-key': apiKey,
      },
    });

    const documents = await response.json();

    expect(documents.value).toBeDefined();
    expect(documents.value.length).toBeGreaterThan(0);
  };

  describe('Search by indicator', () => {
    const searchIndicatorsRequest = async (
      searchTerm: string,
      areaCodes?: string[]
    ) => {
      return await fetch(`${urlPrefix}/docs/search.post.search${URL_SUFFIX}`, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchTerm,
          searchFields: 'indicatorID,indicatorDefinition,indicatorName',
          select: 'indicatorID,indicatorDefinition,indicatorName',
          filter: areaCodes ? formatFilterString(areaCodes) : undefined,
          top: 10,
        }),
        method: 'POST',
      });
    };

    beforeAll(async () => {
      urlPrefix = `${searchEndpoint}/indexes('${INDICATOR_SEARCH_INDEX_NAME}')`;

      const url = `${urlPrefix}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          'api-key': apiKey,
        },
      });
      index = await response.json();
    });

    it('should have correct index name and number of fields', async () => {
      expect(index.name).toBe(INDICATOR_SEARCH_INDEX_NAME);
      expect(index.fields).toMatchSnapshot();
    });

    it('should have correct scoring profile configuration', () => {
      expect(index.scoringProfiles).toMatchSnapshot();
      expect(index.defaultScoringProfile).toBe('basicScoringProfile');
    });

    it('should populate indicator index with data', async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;
      await expectIndexToBePopulated(url);
    });

    it('should return indicators for readmissions', async () => {
      const response = await searchIndicatorsRequest('readmissions');
      const result = await response.json();
      expect(result.value[0].indicatorName).toEqual(
        'Emergency readmissions within 30 days of discharge from hospital'
      );
    });

    it('should return all results when filter based on England', async () => {
      const response = await searchIndicatorsRequest('readmissions', [
        ONS_AREA_CODE_ENGLAND,
      ]);
      const result = await response.json();
      expect(result.value[0].indicatorName).toEqual(
        'Emergency readmissions within 30 days of discharge from hospital'
      );
    });

    it('should filter out results if filtering on an unknown area', async () => {
      const response = await searchIndicatorsRequest('readmissions', [
        'unknown',
      ]);
      const result = await response.json();
      expect(result.value).toHaveLength(0);
    });

    it('should be 3 indicators with 65 and [ONS_AREA_CODE_ENGLAND]', async () => {
      const response = await searchIndicatorsRequest('65', [
        ONS_AREA_CODE_ENGLAND,
      ]);
      const result = await response.json();
      expect(result.value).toHaveLength(3);
    });

    it('should be 2 indicators with 65 and "E38000233"', async () => {
      const response = await searchIndicatorsRequest('65', ['E38000233']);
      const result = await response.json();
      expect(result.value).toHaveLength(2);
    });

    it('should be 1 indicator with 65 and "E07000117"', async () => {
      const response = await searchIndicatorsRequest('65', ['E07000117']);
      const result = await response.json();
      expect(result.value).toHaveLength(1);
    });
  });

  describe('Search by area', () => {
    const SEARCH_TERM = 'man';
    const REQUEST_BODY: TypeAheadBody = {
      search: SEARCH_TERM,
      suggesterName: AREA_SEARCH_SUGGESTER_NAME,
    };

    const makeTypeAheadRequest = async (url: string) => {
      return await fetch(url, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(REQUEST_BODY),
        method: 'POST',
      });
    };

    beforeAll(async () => {
      urlPrefix = `${searchEndpoint}/indexes('${AREA_SEARCH_INDEX_NAME}')`;

      const url = `${urlPrefix}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          'api-key': apiKey,
        },
      });
      index = await response.json();
    });

    it('should have correct index name and number of fields', async () => {
      expect(index.name).toBe(AREA_SEARCH_INDEX_NAME);
      expect(index.fields).toMatchSnapshot();
    });

    it('should populate area index with data', async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;

      await expectIndexToBePopulated(url);
    });

    it('should have autocomplete enabled', async () => {
      const url = `${urlPrefix}/docs/search.post.autocomplete${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: AutoCompleteResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });

    const makeSuggestionsRequest = async (partialText: string) => {
      return await fetch(`${urlPrefix}/docs/search.post.suggest${URL_SUFFIX}`, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: partialText,
          searchFields: 'areaName,areaCode',
          select: 'areaCode,areaType,areaName',
          suggesterName: AREA_SEARCH_SUGGESTER_NAME,
        }),
        method: 'POST',
      });
    };

    it('should have suggestions enabled', async () => {
      const response = await makeSuggestionsRequest('man');
      const results: SuggestionResult = await response.json();
      expect(results.value.length).toBeGreaterThan(0);
    });

    it('should have E08000003 in twice', async () => {
      const response = await makeSuggestionsRequest('E08000003');
      const results: SuggestionResult = await response.json();
      expect(results).toMatchObject({
        value: [
          {
            '@search.text': 'E08000003',
            'areaCode': 'E08000003',
            'areaType': 'Counties and Unitary Authorities',
            'areaName': 'Manchester',
          },
          {
            '@search.text': 'E08000003',
            'areaCode': 'E08000003',
            'areaType': 'Districts and Unitary Authorities',
            'areaName': 'Manchester',
          },
        ],
      });
    });
  });
});
