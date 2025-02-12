import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import {
  AREA_SEARCH_SUGGESTER_NAME,
  AreaDocument,
  AreaSearchIndexColumnNames,
  INDICATOR_SEARCH_SCORING_PROFILE,
  IndicatorDocument,
  IndicatorSearchIndexColumnNames,
} from "./constants.js";

export async function createIndex(
  indexClient: SearchIndexClient,
  index: SearchIndex
): Promise<void> {
  try {
    console.log("Trying to delete an existing index");
    await indexClient.deleteIndex(index);
  } catch { }

  await indexClient.createOrUpdateIndex(index);
  console.log(`Created or modified index with name: ${index.name}`);
}

export async function populateIndex<T extends IndicatorDocument | AreaDocument>(
  searchClient: SearchClient<T>,
  indexData: T[]
): Promise<void> {
  await searchClient.mergeOrUploadDocuments(indexData);
  console.log(`Uploaded data to index with name: ${searchClient.indexName}`);
}

export function buildIndicatorSearchIndex(name: string): SearchIndex {
  return {
    name,
    fields: [
      {
        key: true,
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_ID,
          "Edm.String",
          true,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_NAME,
          "Edm.String",
          true,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_DEFINITION,
          "Edm.String",
          true,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_LATEST_DATA_PERIOD,
          "Edm.String",
          false,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_DATA_SOURCE,
          "Edm.String",
          false,
          true,
          true
        ),
      },
      {
        ...buildSearchIndexField(
          IndicatorSearchIndexColumnNames.INDICATOR_LAST_UPDATED,
          "Edm.DateTimeOffset",
          false,
          true,
          true
        ),
      },
    ],
    scoringProfiles: [
      {
        name: INDICATOR_SEARCH_SCORING_PROFILE,
        textWeights: { weights: { indicatorId: 20, name: 10, definition: 5 } },
      },
    ],
    defaultScoringProfile: INDICATOR_SEARCH_SCORING_PROFILE,
  };
}

export function buildGeographySearchIndex(name: string): SearchIndex {
  return {
    name,
    fields: [
      {
        key: true,
        name: AreaSearchIndexColumnNames.AREA_KEY,
        type: "Edm.String",
        searchable: false,
        sortable: false,
        filterable: false
      },
      {
        name: AreaSearchIndexColumnNames.AREA_CODE,
        type: "Edm.String",
        searchable: true,
        sortable: true,
        filterable: true
      },
      {
        name: AreaSearchIndexColumnNames.AREA_TYPE,
        type: "Edm.String",
        searchable: true,
        sortable: true,
        filterable: true
      },
      {
        name: AreaSearchIndexColumnNames.AREA_NAME,
        type: "Edm.String",
        searchable: true,
        sortable: true,
        filterable: true
      },
    ],
    suggesters: [
      {
        name: AREA_SEARCH_SUGGESTER_NAME,
        searchMode: "analyzingInfixMatching",
        sourceFields: [
          AreaSearchIndexColumnNames.AREA_NAME,
          AreaSearchIndexColumnNames.AREA_CODE,
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
