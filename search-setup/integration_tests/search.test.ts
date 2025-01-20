import {
  DocumentResponse,
  SearchIndexResponse,
  IndexField,
  ScoringProfile,
  ScoringWeight,
  TypeAheadBody,
  AutoCompleteResult,
  SuggestionResult,
} from "../src/types";
import { getEnvironmentVariable } from "../src/utils/helpers";
import {
  GEOGRAPHY_SEARCH_INDEX_NAME,
  GEOGRAPHY_SEARCH_SUGGESTER_NAME,
  GeographySearchIndexColumnNames,
  INDICATOR_SEARCH_INDEX_NAME,
} from "../src/constants";

let index: SearchIndexResponse;
let searchEndpoint: string;
let apiKey: string;
let urlPrefix: string;
const URL_SUFFIX = "?api-version=2024-07-01";

describe("AI search index creation and data loading", () => {
  searchEndpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
  apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");

  const expectFieldToMatch = (
    field: IndexField | undefined,
    expected: {
      name: string;
      type: string;
      retrievable: boolean;
      searchable: boolean;
      sortable: boolean;
      filterable: boolean;
    }
  ) => {
    expect(field).toBeTruthy();
    if (field) {
      expect(field).toMatchObject(expected);
    }
  };

  const expectScoringProfileToMatch = (
    profile: ScoringProfile,
    expected: {
      profileName: string;
      weights: ScoringWeight[];
    }
  ) => {
    expect(profile?.name).toBe(expected.profileName);
    for (const weighting of expected.weights) {
      for (const key of Object.keys(weighting)) {
        expect(profile?.text?.weights).toHaveProperty(key);
        expect(profile?.text?.weights[key]).toBe(weighting[key]);
      }
    }
  };

  const expectIndexToBePopulated = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        "api-key": apiKey,
      },
    });

    const documents: DocumentResponse = await response.json();

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
      expect(index.defaultScoringProfile).toBe("BasicScoringProfile");
    });

    it("should populate indicator index with data", async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;

      await expectIndexToBePopulated(url);
    });
  });

  describe("Search by geography", () => {
    const SEARCH_TERM = "man";
    const REQUEST_BODY: TypeAheadBody = {
      search: SEARCH_TERM,
      suggesterName: GEOGRAPHY_SEARCH_SUGGESTER_NAME,
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
      urlPrefix = `${searchEndpoint}/indexes('${GEOGRAPHY_SEARCH_INDEX_NAME}')`;

      const url = `${urlPrefix}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });
      index = await response.json();
    });

    it("should have correct index name and number of fields", async () => {
      expect(index.name).toBe(GEOGRAPHY_SEARCH_INDEX_NAME);
      expect(index.fields).toMatchSnapshot();
    });

    it("should populate geography index with data", async () => {
      const url = `${urlPrefix}/docs${URL_SUFFIX}`;

      await expectIndexToBePopulated(url);
    });

    it("should have autocomplete enabled", async () => {
      const url = `${urlPrefix}/docs/search.post.autocomplete${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: AutoCompleteResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });

    it("should have suggestions enabled", async () => {
      const url = `${urlPrefix}/docs/search.post.suggest${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: SuggestionResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });
  });
});
