import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { createSearchIndex, populateIndex } from "./indexOperations.js";
import { Data } from "./types.js";
import { sampleData } from "./sample-data.js";

function getEnvironmentVariable(variableName: string): string {
  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue;
}

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
  const apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");
  const indexName = getEnvironmentVariable("AI_SEARCH_INDEX_NAME");

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  await createSearchIndex(indexClient, indexName);

  const searchClient = indexClient.getSearchClient<Data>(indexName);

  await populateIndex(searchClient, sampleData);
}

main().catch((err: Error) => {
  console.error(err.message);
});
