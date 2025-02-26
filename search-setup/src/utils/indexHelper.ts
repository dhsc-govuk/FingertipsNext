import {AreaDocument, IndicatorDocument} from "../constants.js";
import {SearchIndex, SearchIndexClient} from "@azure/search-documents";
import {createIndex, populateIndex} from "../indexOperations.js";

export async function createAndPopulateIndex<
    T extends IndicatorDocument | AreaDocument,
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
