import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import { GeographySearchData, IndicatorSearchData } from "./types.js";

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
      {
        name: "Address",
        type: "Edm.ComplexType",
        fields: [
          buildSearchIndexField("AddressLine1", "Edm.String", true, true, true),
          buildSearchIndexField(
            "AddressLine2",
            "Edm.String",
            true,
            false,
            false
          ),
          buildSearchIndexField(
            "AddressLine3",
            "Edm.String",
            true,
            false,
            false
          ),
          buildSearchIndexField(
            "AddressLine4",
            "Edm.String",
            true,
            false,
            false
          ),
          buildSearchIndexField("Postcode", "Edm.String", true, true, true),
        ],
      },
    ],
    suggesters: [
      {
        name: "sg",
        searchMode: "analyzingInfixMatching",
        sourceFields: ["Name", "Address/AddressLine1", "Address/Postcode"],
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
