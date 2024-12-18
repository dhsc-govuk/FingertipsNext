import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
} from "@azure/search-documents";
import { Data, fields } from "./types.js";

export async function getOrCreateSearchIndex(
  indexClient: SearchIndexClient,
  indexName: string
): Promise<void> {
  try {
    await checkForExistingIndex(indexClient, indexName);
    console.log("index already exists");
  } catch {
    await createSearchIndex(indexClient, indexName);
    console.log("created new index");
  }
}

export async function loadIndex(
  searchClient: SearchClient<Data>,
  indexData: Data[]
): Promise<void> {
  await searchClient.mergeOrUploadDocuments(indexData);
}

async function checkForExistingIndex(
  indexClient: SearchIndexClient,
  indexName: string
): Promise<void> {
  await indexClient.getIndex(indexName);
}

async function createSearchIndex(
  indexClient: SearchIndexClient,
  indexName: string
): Promise<void> {
  const index = buildSearchIndex(indexName);
  await indexClient.createIndex(index);
}

function buildSearchIndex(indexName: string): SearchIndex {
  return {
    name: indexName,
    fields: fields.map((field) => {
      if (field.complex && field.fields) {
        return {
          name: field.name,
          type: "Edm.ComplexType",
          fields: field.fields?.map((subField) =>
            buildSearchIndexField(subField)
          ),
        };
      }
      return buildSearchIndexField(field.name, field.key);
    }),
  };
}

function buildSearchIndexField(fieldName: string, key = false): SearchField {
  return {
    type: "Edm.String",
    name: fieldName,
    sortable: true,
    searchable: true,
    filterable: true,
    key,
  };
}
