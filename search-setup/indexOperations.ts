import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import { Data } from "./types.js";

export async function createSearchIndex(
  indexClient: SearchIndexClient,
  indexName: string
): Promise<void> {
  const index = buildSearchIndex(indexName);
  await indexClient.createOrUpdateIndex(index);
  console.log(`Created or modified index with name: ${indexName}`);
}

export async function populateIndex(
  searchClient: SearchClient<Data>,
  indexData: Data[]
): Promise<void> {
  await searchClient.mergeOrUploadDocuments(indexData);
  console.log(`Uploaded data to index with name: ${searchClient.indexName}`);
}

function buildSearchIndex(name: string): SearchIndex {
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

function buildSearchIndexField(
  name: string,
  type: SearchFieldDataType,
  sortable: boolean,
  searchable: boolean,
  filterable: boolean,
  hidden: boolean = false
): SearchField {
  return {
    name,
    type,
    sortable,
    searchable,
    filterable,
    hidden,
  };
}
