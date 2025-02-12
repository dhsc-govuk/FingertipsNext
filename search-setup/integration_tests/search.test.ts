import {
  AREA_SEARCH_INDEX_NAME,
  AREA_SEARCH_SUGGESTER_NAME,
  INDICATOR_SEARCH_INDEX_NAME,
} from "../src/constants";
import {
  AutoCompleteResult,
  SearchIndexResponse,
  SuggestionResult,
  TypeAheadBody,
} from "../src/types";

let index: SearchIndexResponse;
let searchEndpoint: string;
let apiKey: string;
let urlPrefix: string;
const URL_SUFFIX = "?api-version=2024-07-01";

describe("AI search index creation and data loading", () => {
  searchEndpoint = process.env.AI_SEARCH_SERVICE_ENDPOINT!;
  apiKey = process.env.AI_SEARCH_API_KEY!;

  const expectIndexToBePopulated = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        "api-key": apiKey,
      },
    });

    const documents = await response.json();

    expect(documents.value).toBeDefined();
    expect(documents.value.length).toBeGreaterThan(0);
  };

  describe("Search by indicator", () => {
    beforeAll(async () => {
      urlPrefix = `${searchEndpoint}/indexes('${INDICATOR_SEARCH_INDEX_NAME}')`;

      const url = `${urlPrefix}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });
      index = await response.json();
    });

    it("should have correct index name and number of fields", async () => {
      expect(index.name).toBe(INDICATOR_SEARCH_INDEX_NAME);
      expect(index.fields).toMatchSnapshot();
    });

    it("should have correct scoring profile configuration", () => {
      expect(index.scoringProfiles).toMatchSnapshot();
      expect(index.defaultScoringProfile).toBe("basicScoringProfile");
    });

    it("should populate indicator index with data", async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;

      await expectIndexToBePopulated(url);
    });
  });

  describe("Search by area", () => {
    const SEARCH_TERM = "man";
    const REQUEST_BODY: TypeAheadBody = {
      search: SEARCH_TERM,
      suggesterName: AREA_SEARCH_SUGGESTER_NAME,
    };

    const makeTypeAheadRequest = async (url: string) => {
      return await fetch(url, {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(REQUEST_BODY),
        method: "POST",
      });
    };

    beforeAll(async () => {
      urlPrefix = `${searchEndpoint}/indexes('${AREA_SEARCH_INDEX_NAME}')`;

      const url = `${urlPrefix}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });
      index = await response.json();
    });

    it("should have correct index name and number of fields", async () => {
      expect(index.name).toBe(AREA_SEARCH_INDEX_NAME);
      expect(index.fields).toMatchSnapshot();
    });

    it("should populate area index with data", async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;

      await expectIndexToBePopulated(url);
    });

    it("should have autocomplete enabled", async () => {
      const url = `${urlPrefix}/docs/search.post.autocomplete${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: AutoCompleteResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });

    const makeSuggestionsRequest = async (partialText: string) => {
      return await fetch(`${urlPrefix}/docs/search.post.suggest${URL_SUFFIX}`, {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: partialText,
          searchFields: "areaName,areaCode",
          select: "areaCode,areaType,areaName",
          suggesterName: AREA_SEARCH_SUGGESTER_NAME,
        }),
        method: "POST",
      });
    };

    it("should have suggestions enabled", async () => {

      const response = await makeSuggestionsRequest('man');
      const results: SuggestionResult = await response.json();
      expect(results.value.length).toBeGreaterThan(0);
    });

    it("should have E08000003 in twice", async () => {
      const response = await makeSuggestionsRequest('E08000003');
      const results: SuggestionResult = await response.json();
      console.log(results);
      expect(results).toMatchObject({
        value: [
          {
            '@search.text': 'E08000003',
            areaCode: 'E08000003',
            areaType: 'Counties and Unitary Authorities',
            areaName: 'Manchester'
          },
          {
            '@search.text': 'E08000003',
            areaCode: 'E08000003',
            areaType: 'Districts and Unitary Authorities',
            areaName: 'Manchester'
          }
        ]

      });
    });
  });
});
