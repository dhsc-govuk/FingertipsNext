import { config } from "dotenv";
import {
  DocumentResponse,
  SearchIndexResponse,
  IndexField,
  ScoringProfile,
  ScoringWeight,
} from "../types";
import { getEnvironmentVariable } from "../utils/helpers";

config();

const searchEndpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
const indexName = getEnvironmentVariable("AI_SEARCH_INDEX_NAME");
const apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");

describe("AI search index creation and data loading", () => {
  const URL_PREFIX = `${searchEndpoint}/indexes('${indexName}')`;
  const URL_SUFFIX = "?api-version=2024-07-01";

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

  const expectComplexFieldToMatch = (
    field: IndexField | undefined,
    expected: {
      name: string;
      fieldLength: number;
    }
  ) => {
    expect(field).toBeTruthy();
    if (field) {
      expect(field?.name).toBe(expected.name);
      expect(field?.type).toBe("Edm.ComplexType");
      expect(field?.fields?.length).toBe(expected.fieldLength);
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

  describe("Index structure from indexes url", () => {
    let index: SearchIndexResponse;

    beforeAll(async () => {
      const url = `${URL_PREFIX}${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });
      index = await response.json();
    });

    it("should have correct index name and number of fields", async () => {
      expect(index.name).toBe(indexName);
      expect(index.fields.length).toBe(2);
    });

    it("should have correct IID field configuration", () => {
      const iidField = index.fields[0];
      expectFieldToMatch(iidField, {
        name: "IID",
        type: "Edm.String",
        retrievable: true,
        searchable: true,
        sortable: true,
        filterable: true,
      });
      expect(iidField.key).toBe(true);
    });

    it("should have correct Descriptive field configuration", () => {
      const descriptiveField = index.fields[1];
      expectComplexFieldToMatch(descriptiveField, {
        name: "Descriptive",
        fieldLength: 2,
      });
      expectFieldToMatch(descriptiveField.fields![0], {
        name: "Name",
        type: "Edm.String",
        retrievable: true,
        searchable: true,
        sortable: true,
        filterable: true,
      });
      expectFieldToMatch(descriptiveField.fields![1], {
        name: "Definition",
        type: "Edm.String",
        retrievable: true,
        searchable: true,
        sortable: true,
        filterable: true,
      });
    });

    it("should have correct scoring profile configuration", () => {
      expectScoringProfileToMatch(index.scoringProfiles[0], {
        profileName: "BasicScoringProfile",
        weights: [
          { IID: 20 },
          { "Descriptive/Name": 10 },
          { "Descriptive/Definition": 5 },
        ],
      });
    });
  });

  describe("Index data from docs url", () => {
    test("should populate data", async () => {
      const url = `${URL_PREFIX}/docs${URL_SUFFIX}`;
      const response = await fetch(url, {
        headers: {
          "api-key": apiKey,
        },
      });
      const documents: DocumentResponse = await response.json();

      expect(documents.value).toBeDefined();
      expect(documents.value.length).toBeGreaterThan(0);

      const firstDocument = documents.value[0];
      expect(firstDocument).toHaveProperty("IID");
      expect(firstDocument).toHaveProperty("Descriptive");
      expect(firstDocument.Descriptive).toHaveProperty("Name");
      expect(firstDocument.Descriptive).toHaveProperty("Definition");
    });
  });
});
