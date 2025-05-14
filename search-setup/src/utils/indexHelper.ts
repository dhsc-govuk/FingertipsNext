import {
  AreaDocument,
  IndicatorDocument,
  SPECIAL_CHARS,
} from '../constants.js';
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
  } catch (error) {
    console.error('error deleting synonym map', error);
  }
  console.log(`Creating synonym map ${synonymMapName}`);
  const synonymMap: SynonymMap = {
    name: synonymMapName,
    synonyms: generateSynonyms(synonymData),
  };
  await indexClient.createSynonymMap(synonymMap);
  console.log(`Created synonym map named: ${synonymMapName}`);
}

function generateSynonyms(synonymData: SynonymData): string[] {
  return synonymData.map((keywordObject) =>
    keywordObject.isExplicit
      ? `${keywordObject.keyword} => ${generateMappingString(keywordObject.keyword, keywordObject.synonyms)}`
      : generateMappingString(keywordObject.keyword, keywordObject.synonyms)
  );
}

function generateMappingString(keyword: string, synonyms: string[]) {
  const mappingString = [keyword, ...synonyms].join(', ');
  return escapeSpecialCharacters(mappingString);
}

function escapeSpecialCharacters(mappingString: string) {
  let resultString = mappingString;
  SPECIAL_CHARS.forEach((char) => {
    resultString = resultString.replaceAll(char, `\\${char}`);
  });
  return resultString;
}
