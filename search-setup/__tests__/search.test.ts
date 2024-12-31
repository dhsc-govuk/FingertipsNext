import { config } from "dotenv";
import { DocumentResponse, SearchIndexResponse, IndexField, ScoringProfile } from "../types";
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

  const expectScoringProfileToMatch = (
    profile: ScoringProfile,
    profileName: string,
    fieldName: string,
    weight: number
  ) => {
    expect(profile?.name).toBe(profileName);
    expect(profile?.text?.weights).toHaveProperty(fieldName);
    expect(profile?.text?.weights[fieldName]).toBe(weight);
  };

  test("should create index with expected fields", async () => {
    const url = `${URL_PREFIX}${URL_SUFFIX}`;

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
    expectScoringProfileToMatch(index.scoringProfiles[0], "IndicatorScoringProfile", "IID", 20);
    expectScoringProfileToMatch(index.scoringProfiles[1], "NameScoringProfile", "IID", 10);
    expectScoringProfileToMatch(index.scoringProfiles[2], "DefinitionScoringProfile", "IID", 5);
  });

  test("should populate index with data", async () => {
    const url = `${URL_PREFIX}/docs${URL_SUFFIX}`;

    const response = await fetch(url, {
      headers: {
        "api-key": apiKey,
      },
    });

    const documents: DocumentResponse = await response.json();

    expect(documents.value.length).toBeGreaterThan(0);
  });
});
