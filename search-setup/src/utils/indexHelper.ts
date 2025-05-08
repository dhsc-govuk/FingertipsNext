import { AreaDocument, IndicatorDocument } from '../constants.js';
import { SearchIndex, SearchIndexClient, SynonymMap } from '@azure/search-documents';
import { createIndex, populateIndex } from '../indexOperations.js';

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

export async function createSynonymMap(synonymMapName: string, indexClient: SearchIndexClient, synonymData: Record<string, string[]>) {
  try {
    console.log(`Trying to delete an existing synonym map named: ${synonymMapName}`)
    await indexClient.deleteSynonymMap(synonymMapName)
  } catch {}
  console.log(`Creating synonym map ${synonymMapName}`)
  const synonymMap: SynonymMap = {
    name: synonymMapName,
    synonyms: generateSynonyms(synonymData)
  }
  await indexClient.createSynonymMap(synonymMap)
  console.log(`Created synonym map named: ${synonymMapName}`)
}

function generateSynonyms(synonymData: Record<string, string[]>): string[] {
  return Object.entries(synonymData).map((wordMapping) => {
    return `${wordMapping[0]} => ${wordMapping[1].join(', ')}`
  })
}
