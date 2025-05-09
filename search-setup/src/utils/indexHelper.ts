import { AreaDocument, IndicatorDocument } from '../constants.js';
import {
  SearchIndex,
  SearchIndexClient,
  SynonymMap,
} from '@azure/search-documents';
import { createIndex, populateIndex } from '../indexOperations.js';
import { SynonymData } from '../types.js';

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

export async function createSynonymMap(
  synonymMapName: string,
  indexClient: SearchIndexClient,
  synonymData: SynonymData
) {
  try {
    console.log(
      `Trying to delete an existing synonym map named: ${synonymMapName}`
    );
    await indexClient.deleteSynonymMap(synonymMapName);
  } catch {}
  console.log(`Creating synonym map ${synonymMapName}`);
  const synonymMap: SynonymMap = {
    name: synonymMapName,
    synonyms: generateSynonyms(synonymData),
  };
  await indexClient.createSynonymMap(synonymMap);
  console.log(`Created synonym map named: ${synonymMapName}`);
}

function generateSynonyms(synonymData: SynonymData): string[] {
  return Object.entries(synonymData).map((wordMapping) => {
    const keyword = wordMapping[0];
    const synonymObject = wordMapping[1];
    return synonymObject.isAcronym
      ? `${keyword} => ${synonymObject.terms.join(', ')}`
      : `${[keyword, ...synonymObject.terms].join(', ')}`;
  });
}
