import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { getOrCreateSearchIndex, loadIndex } from "./indexOperations.js";
import { Data, sampleData } from "./types.js";

function getEnvironmentVariable(variableName: string): string {
  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue;
}

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable("SEARCH_SERVICE_ENDPOINT");
  const apiKey = getEnvironmentVariable("SEARCH_API_KEY");
  const indexName = getEnvironmentVariable("AI_SEARCH_INDEX_NAME");

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  await getOrCreateSearchIndex(indexClient, indexName);

  const searchClient = indexClient.getSearchClient<Data>(indexName);

  await loadIndex(searchClient, sampleData);
}

main().catch((err: Error) => {
  console.error(err.message);
});
