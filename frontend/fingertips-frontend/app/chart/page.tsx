import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import {
  PopulationData,
  preparePopulationData,
} from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.[SearchParams.SearchedIndicator];
  const indicatorsSelected = asArray(
    searchParams?.[SearchParams.IndicatorsSelected]
  );
  const areaCodes = asArray(searchParams?.[SearchParams.AreasSelected]);
  const selectedAreaType = searchParams?.[SearchParams.AreaTypeSelected];
  const selectedGroupCode = searchParams?.[SearchParams.GroupSelected];

  // We don't want to render this page statically
  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [...areaCodes, areaCodeForEngland, selectedGroupCode]
      : [...areaCodes, areaCodeForEngland];

  const healthIndicatorData = await Promise.all(
    indicatorsSelected.map((indicatorId) =>
      indicatorApi.getHealthDataForAnIndicator({
        indicatorId: Number(indicatorId),
        areaCodes: areaCodesToRequest,
      })
    )
  );

  let rawPopulationData: HealthDataForArea[] | undefined;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [...areaCodes, areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  // Passing the first two area codes until business logic to select baseline comparator for pop pyramids is added
  const preparedPopulationData: PopulationData | undefined = rawPopulationData
    ? preparePopulationData(rawPopulationData, areaCodes[0], areaCodes[1])
    : undefined;

  // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
  const mapDataIsRequired =
    selectedAreaType &&
    indicatorsSelected.length === 1 &&
    areaCodes.length >= 2;

  const mapData = mapDataIsRequired
    ? getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areaCodes)
    : undefined;

  return (
    <Chart
      populationData={preparedPopulationData}
      healthIndicatorData={healthIndicatorData}
      selectedGroupCode={selectedGroupCode}
      mapData={mapData}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
      areasSelected={areaCodes}
    />
  );
}
