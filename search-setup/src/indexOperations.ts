import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import { GeographySearchData, IndicatorSearchData } from "./types";
import {
  GEOGRAPHY_SEARCH_SUGGESTER_NAME,
  GeographySearchIndexColumnNames,
} from "./constants.js";

export async function createIndex(
  indexClient: SearchIndexClient,
  index: SearchIndex
): Promise<void> {
  try {
    console.log("Trying to delete an existing index");
    await indexClient.deleteIndex(index);
  } catch {}

  await indexClient.createOrUpdateIndex(index);
  console.log(`Created or modified index with name: ${index.name}`);
}

export async function populateIndex<
  T extends IndicatorSearchData | GeographySearchData
>(searchClient: SearchClient<T>, indexData: T[]): Promise<void> {
  await searchClient.mergeOrUploadDocuments(indexData);
  console.log(`Uploaded data to index with name: ${searchClient.indexName}`);
}

export function buildIndicatorSearchIndex(name: string): SearchIndex {
  return {
    name,
    fields: [
      {
        key: true,
        ...buildSearchIndexField("indicatorId", "Edm.String", true, true, true),
      },
      {
        ...buildSearchIndexField("name", "Edm.String", true, true, true),
      },
      {
        ...buildSearchIndexField("definition", "Edm.String", true, true, true),
      },
      {
        ...buildSearchIndexField(
          "latestDataPeriod",
          "Edm.String",
          false,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField("dataSource", "Edm.String", false, true, true),
      },
      {
        ...buildSearchIndexField(
          "lastUpdated",
          "Edm.DateTimeOffset",
          false,
          true,
          true
        ),
      },
    ],
    scoringProfiles: [
      {
        name: "BasicScoringProfile",
        textWeights: { weights: { indicatorId: 20, name: 10, definition: 5 } },
      },
    ],
    defaultScoringProfile: "BasicScoringProfile",
  };
}

export function buildGeographySearchIndex(name: string): SearchIndex {
  return {
    name,
    fields: [
      {
        key: true,
        ...buildSearchIndexField(
          GeographySearchIndexColumnNames.AREA_CODE,
          "Edm.String",
          true,
          true,
          true
        ),
      },
      buildSearchIndexField(
        GeographySearchIndexColumnNames.AREA_NAME,
        "Edm.String",
        true,
        true,
        true
      ),
      buildSearchIndexField(
        GeographySearchIndexColumnNames.AREA_TYPE,
        "Edm.String",
        true,
        true,
        true
      ),
    ],
    suggesters: [
      {
        name: GEOGRAPHY_SEARCH_SUGGESTER_NAME,
        searchMode: "analyzingInfixMatching",
        sourceFields: [
          GeographySearchIndexColumnNames.AREA_NAME,
          GeographySearchIndexColumnNames.AREA_CODE,
        ],
      },
    ],
  };
}

function buildSearchIndexField(
  name: string,
  type: SearchFieldDataType,
  searchable: boolean,
  sortable: boolean,
  filterable: boolean,
  hidden: boolean = false
): SearchField {
  return {
    name,
    type,
    searchable,
    sortable,
    filterable,
    hidden,
  };
}
