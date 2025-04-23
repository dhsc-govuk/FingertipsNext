import { createIndex, populateIndex } from '../indexOperations.js';
export async function createAndPopulateIndex(indexClient, buildIndexFunction, indexName, data) {
    console.log(`Creating index ${indexName}`);
    await createIndex(indexClient, buildIndexFunction(indexName));
    await populateIndex(indexClient.getSearchClient(indexName), data);
}
