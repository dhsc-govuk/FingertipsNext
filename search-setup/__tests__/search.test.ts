import { config } from "dotenv";
import {
  DocumentResponse,
  SearchIndexResponse,
  IndexField,
  AutoCompleteResult,
  TypeAheadBody,
  SuggestionResult,
} from "../types";
import { getEnvironmentVariable } from "../utils/helpers";

config();

const searchEndpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
const apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");

describe("AI search index creation and data loading", () => {
  let indexName: string;
  let urlPrefix: string;
  const URL_SUFFIX = "?api-version=2024-07-01";

  describe("Search by indicator", () => {
    beforeEach(() => {
      indexName = getEnvironmentVariable("AI_SEARCH_BY_INDICATOR_INDEX_NAME");
      urlPrefix = `${searchEndpoint}/indexes('${indexName}')`;
    });

    test("should create indicator index with expected fields", async () => {
      const url = `${urlPrefix}${URL_SUFFIX}`;

      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });

      const index: SearchIndexResponse = await response.json();

      expect(index.name).toBe(indexName);
      expect(index.fields.length).toBe(2);
      expectFieldToMatch(
        index.fields.at(0),
        "IID",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expect(index.fields.at(0)?.key).toBe(true);
      expectComplexFieldToMatch(index.fields.at(1), "Descriptive", 2);
      expectFieldToMatch(
        index.fields.at(1)?.fields?.at(0),
        "Name",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expectFieldToMatch(
        index.fields.at(1)?.fields?.at(1),
        "Definition",
        "Edm.String",
        true,
        true,
        true,
        true
      );
    });

    test("should populate indicator index with data", async () => {
      await expectIndexToBePopulated();
    });
  });

  describe("Search by geography", () => {
    const SEARCH_TERM = "man";
    const SUGGESTER_NAME = "sg";
    const REQUEST_BODY: TypeAheadBody = {
      search: SEARCH_TERM,
      suggesterName: SUGGESTER_NAME,
    };

    beforeEach(() => {
      indexName = getEnvironmentVariable("AI_SEARCH_BY_GEOGRAPHY_INDEX_NAME");
      urlPrefix = `${searchEndpoint}/indexes('${indexName}')`;
    });

    test("should create geography index with expected fields", async () => {
      const url = `${urlPrefix}${URL_SUFFIX}`;

      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });

      const index: SearchIndexResponse = await response.json();

      expect(index.name).toBe(indexName);
      expect(index.fields.length).toBe(4);
      expect(index.fields.at(0)?.key).toBe(true);
      expectFieldToMatch(
        index.fields.at(0),
        "ID",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expectFieldToMatch(
        index.fields.at(1),
        "Name",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expectFieldToMatch(
        index.fields.at(2),
        "Type",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expectComplexFieldToMatch(index.fields.at(3), "Address", 5);
      expectFieldToMatch(
        index.fields.at(3)?.fields?.at(0),
        "AddressLine1",
        "Edm.String",
        true,
        true,
        true,
        true
      );
      expectFieldToMatch(
        index.fields.at(3)?.fields?.at(1),
        "AddressLine2",
        "Edm.String",
        true,
        true,
        false,
        false
      );
      expectFieldToMatch(
        index.fields.at(3)?.fields?.at(2),
        "AddressLine3",
        "Edm.String",
        true,
        true,
        false,
        false
      );
      expectFieldToMatch(
        index.fields.at(3)?.fields?.at(3),
        "AddressLine4",
        "Edm.String",
        true,
        true,
        false,
        false
      );
      expectFieldToMatch(
        index.fields.at(3)?.fields?.at(4),
        "Postcode",
        "Edm.String",
        true,
        true,
        true,
        true
      );
    });

    test("should populate geography index with data", async () => {
      await expectIndexToBePopulated();
    });

    test("should have autocomplete enabled", async () => {
      const url = `${urlPrefix}/docs/search.post.autocomplete${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: AutoCompleteResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });

    test("should have suggestions enabled", async () => {
      const url = `${urlPrefix}/docs/search.post.suggest${URL_SUFFIX}`;

      const response = await makeTypeAheadRequest(url);

      const results: SuggestionResult = await response.json();

      expect(results.value.length).toBeGreaterThan(0);
    });

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
  });

  const expectFieldToMatch = (
    field: IndexField | undefined,
    name: string,
    type: string,
    retrievable: boolean,
    searchable: boolean,
    sortable: boolean,
    filterable: boolean
  ) => {
    expect(field?.name).toBe(name);
    expect(field?.type).toBe(type);
    expect(field?.retrievable).toBe(retrievable);
    expect(field?.searchable).toBe(searchable);
    expect(field?.sortable).toBe(sortable);
    expect(field?.filterable).toBe(filterable);
  };

  const expectComplexFieldToMatch = (
    field: IndexField | undefined,
    name: string,
    fieldLength: number
  ) => {
    expect(field?.name).toBe(name);
    expect(field?.type).toBe("Edm.ComplexType");
    expect(field?.fields?.length).toBe(fieldLength);
  };

  const expectIndexToBePopulated = async () => {
    const url = `${urlPrefix}/docs${URL_SUFFIX}`;

    const response = await fetch(url, {
      headers: {
        "api-key": apiKey,
      },
    });

    const documents: DocumentResponse = await response.json();

    expect(documents.value.length).toBeGreaterThan(0);
  };
});
