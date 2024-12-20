import { config } from "dotenv";
import { DocumentResponse, SearchIndexResponse } from "../types";

config();

const searchEndpoint = process.env["AI_SEARCH_SERVICE_ENDPOINT"] ?? "";
const indexName = process.env["AI_SEARCH_INDEX_NAME"];
const apiKey = process.env["AI_SEARCH_API_KEY"] ?? "";

describe("AI search index creation and data loading", () => {
  const URL_PREFIX = `${searchEndpoint}/indexes('${indexName}')`;
  const URL_SUFFIX = "?api-version=2024-07-01";

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
    expect(index.fields.at(0)?.name).toBe("IID");
    expect(index.fields.at(0)?.type).toBe("Edm.String");
    expect(index.fields.at(0)?.key).toBe(true);
    expect(index.fields.at(0)?.retrievable).toBe(true);
    expect(index.fields.at(1)?.name).toBe("Descriptive");
    expect(index.fields.at(1)?.type).toBe("Edm.ComplexType");
    expect(index.fields.at(1)?.fields?.length).toBe(2);
    expect(index.fields.at(1)?.fields?.at(0)?.name).toBe("Name");
    expect(index.fields.at(1)?.fields?.at(1)?.name).toBe("Definition");
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
