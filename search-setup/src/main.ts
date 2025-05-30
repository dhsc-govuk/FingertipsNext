import { SearchIndexClient, AzureKeyCredential } from '@azure/search-documents';
import {
  buildGeographySearchIndex,
  buildIndicatorSearchIndex,
} from './indexOperations.js';
import {
  getEnvironmentVariable,
  getIndicatorsJsonData,
} from './utils/helpers.js';
import {
  createDistrictLevelFromCounty,
  parseAreaData,
} from './utils/areaDocumentHelpers.js';
import { parseIndicatorData } from './utils/indicatorDocumentHelpers.js';
import {
  AREA_SEARCH_INDEX_NAME,
  INDICATOR_SEARCH_INDEX_NAME,
  INDICATOR_SEARCH_SYNONYM_MAP_NAME,
} from './constants.js';
import rawAreasData from '../assets/areas.json' with { type: 'json' };
import {
  createAndPopulateIndex,
  createSynonymMap,
} from './utils/indexHelper.js';
import synonymData from '../assets/indicator-synonyms.json' with { type: 'json' };

async function main(): Promise<void> {
  const endpoint = getEnvironmentVariable('AI_SEARCH_SERVICE_ENDPOINT');
  const apiKey = getEnvironmentVariable('AI_SEARCH_API_KEY');
  const indicatorSearchIndexName = getEnvironmentVariable(
    'INDICATOR_SEARCH_INDEX_NAME_OVERRIDE',
    INDICATOR_SEARCH_INDEX_NAME
  );
  const areaSearchIndexName = getEnvironmentVariable(
    'AREA_SEARCH_INDEX_NAME_OVERRIDE',
    AREA_SEARCH_INDEX_NAME
  );
  const rawIndicatorData = getIndicatorsJsonData();

  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  const indicatorData = parseIndicatorData(rawIndicatorData);

  await createSynonymMap(
    INDICATOR_SEARCH_SYNONYM_MAP_NAME,
    indexClient,
    synonymData
  );
  await createAndPopulateIndex(
    indexClient,
    buildIndicatorSearchIndex,
    indicatorSearchIndexName,
    indicatorData
  );

  const areaData = parseAreaData(rawAreasData);
  const newDistrictAreas = createDistrictLevelFromCounty(areaData);
  const extendedAreaData = areaData.concat(newDistrictAreas);

  await createAndPopulateIndex(
    indexClient,
    buildGeographySearchIndex,
    areaSearchIndexName,
    extendedAreaData
  );
}

main().catch((err: Error) => {
  console.error(err);
});
