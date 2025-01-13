import {
  SearchIndex,
  SearchIndexClient,
  SearchField,
  SearchClient,
  SearchFieldDataType,
} from "@azure/search-documents";
import { GeographySearchData, IndicatorSearchData } from "../types";
import { geographySearchSuggesterName } from "./constants.js";

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
    scoringProfiles: [
      {
        name: "BasicScoringProfile",
        textWeights: {
          weights: {
            IID: 20,
            "Descriptive/Name": 10,
            "Descriptive/Definition": 5,
          },
        },
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
        ...buildSearchIndexField("areaCode", "Edm.String", true, true, true),
      },
      buildSearchIndexField("areaName", "Edm.String", true, true, true),
      buildSearchIndexField("areaType", "Edm.String", true, true, true),
    ],
    suggesters: [
      {
        name: geographySearchSuggesterName,
        searchMode: "analyzingInfixMatching",
        sourceFields: ["areaName", "areaCode"],
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
