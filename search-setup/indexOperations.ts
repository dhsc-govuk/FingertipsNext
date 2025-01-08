import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import { GeographySearchData, IndicatorSearchData } from "./types.js";
import { getEnvironmentVariable } from "./utils/helpers.js";

export async function createIndex(
  indexClient: SearchIndexClient,
  index: SearchIndex
): Promise<void> {
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
        ...buildSearchIndexField("IID", "Edm.String", true, true, true),
      },
      {
        name: "Descriptive",
        type: "Edm.ComplexType",
        fields: [
          buildSearchIndexField("Name", "Edm.String", true, true, true),
          buildSearchIndexField("Definition", "Edm.String", true, true, true),
        ],
      },
    ],
  };
}

export function buildGeographySearchIndex(name: string): SearchIndex {
  return {
    name,
    fields: [
      {
        key: true,
        ...buildSearchIndexField("ID", "Edm.String", true, true, true),
      },
      buildSearchIndexField("Name", "Edm.String", true, true, true),
      buildSearchIndexField("Type", "Edm.String", true, true, true),
      buildSearchIndexField("Postcode", "Edm.String", true, true, true),
    ],
    suggesters: [
      {
        name: getEnvironmentVariable(
          "AI_SEARCH_BY_GEOGRAPHY_INDEX_SUGGESTER_NAME"
        ),
        searchMode: "analyzingInfixMatching",
        sourceFields: ["Name", "Postcode"],
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
