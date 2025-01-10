import fs from "fs";
import {
  SearchIndexClient,
  AzureKeyCredential,
  SearchIndex,
} from "@azure/search-documents";
import {
  buildGeographySearchIndex,
  buildIndicatorSearchIndex,
  createIndex,
  populateIndex,
} from "./indexOperations.js";
import { GeographySearchData, IndicatorSearchData } from "../types.js";
import { sampleGeographyData, sampleIndicatorData } from "./sample-data.js";
import { getEnvironmentVariable } from "./utils/helpers.js";

async function createAndPopulateIndex<
  T extends IndicatorSearchData | GeographySearchData
>(
  indexClient: SearchIndexClient,
  buildIndexFunction: (arg: string) => SearchIndex,
  indexName: string,
  data: T[]
) {
  console.log(`CreatingIndex ${indexName}`);
  await createIndex(indexClient, buildIndexFunction(indexName));

  await populateIndex<T>(indexClient.getSearchClient<T>(indexName), data);
}

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
  const apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");
  const indicatorSearchIndexName = getEnvironmentVariable(
    "AI_SEARCH_BY_INDICATOR_INDEX_NAME"
  );
  const geographySearchIndexName = getEnvironmentVariable(
    "AI_SEARCH_BY_GEOGRAPHY_INDEX_NAME"
  );

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  await createAndPopulateIndex(
    indexClient,
    buildIndicatorSearchIndex,
    indicatorSearchIndexName,
    sampleIndicatorData
  );

  const geoData = JSON.parse(
    fs.readFileSync("./assets/geographyData.json", "utf-8")
  );

  await createAndPopulateIndex(
    indexClient,
    buildGeographySearchIndex,
    geographySearchIndexName,
    geoData
  );
}

main().catch((err: Error) => {
  console.error(err);
});
