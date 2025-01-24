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
import { getEnvironmentVariable } from "./utils/helpers.js";
import {
  AREA_SEARCH_INDEX_NAME,
  AreaDocument,
  INDICATOR_SEARCH_INDEX_NAME,
  IndicatorDocument,
} from "./constants.js";

import areaData from "../assets/areaData.json" with {type:"json"};
import indicatorData from "../assets/indicatorData.json" with {type:"json"};

async function createAndPopulateIndex<
  T extends IndicatorDocument | AreaDocument
>(
  indexClient: SearchIndexClient,
  buildIndexFunction: (arg: string) => SearchIndex,
  indexName: string,
  data: T[]
) {
  console.log(`Creating index ${indexName}`);
  await createIndex(indexClient, buildIndexFunction(indexName));

  await populateIndex<T>(indexClient.getSearchClient<T>(indexName), data);
}

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable("AI_SEARCH_SERVICE_ENDPOINT");
  const apiKey = getEnvironmentVariable("AI_SEARCH_API_KEY");

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  const typedIndicatorData = indicatorData.map((indicator)=>{
    return {
      ...indicator,
      lastUpdated : new Date(indicator.lastUpdated)
    }
  })

  await createAndPopulateIndex(
    indexClient,
    buildIndicatorSearchIndex,
    INDICATOR_SEARCH_INDEX_NAME,
    typedIndicatorData 
  );

  await createAndPopulateIndex(
    indexClient,
    buildGeographySearchIndex,
    AREA_SEARCH_INDEX_NAME,
    areaData
  );
}

main().catch((err: Error) => {
  console.error(err);
});
