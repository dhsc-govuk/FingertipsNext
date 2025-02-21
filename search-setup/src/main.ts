import {
  SearchIndexClient,
  AzureKeyCredential,
  SearchIndex,
} from '@azure/search-documents';
import {
  buildGeographySearchIndex,
  buildIndicatorSearchIndex,
  createIndex,
  populateIndex,
} from './indexOperations.js';
import {
  createDistrictLevelFromCounty,
  getEnvironmentVariable,
  parseAreaData,
  parseIndicatorData,
} from './utils/helpers.js';
import {
  AREA_SEARCH_INDEX_NAME,
  AreaDocument,
  INDICATOR_SEARCH_INDEX_NAME,
  IndicatorDocument,
} from './constants.js';

import rawAreasData from '../assets/areas.json' with { type: 'json' };
import rawIndicatorData from '../assets/indicators.json' with { type: 'json' };

async function createAndPopulateIndex<
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

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable('AI_SEARCH_SERVICE_ENDPOINT');
  const apiKey = getEnvironmentVariable('AI_SEARCH_API_KEY');

  const areaData = parseAreaData(rawAreasData);
  const newDistrictAreas = createDistrictLevelFromCounty(areaData);
  const extendedAreaData = areaData.concat(newDistrictAreas);

  const indicatorData = parseIndicatorData(rawIndicatorData);

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  await createAndPopulateIndex(
    indexClient,
    buildIndicatorSearchIndex,
    INDICATOR_SEARCH_INDEX_NAME,
    indicatorData
  );

  await createAndPopulateIndex(
    indexClient,
    buildGeographySearchIndex,
    AREA_SEARCH_INDEX_NAME,
    extendedAreaData
  );
}

main().catch((err: Error) => {
  console.error(err);
});
