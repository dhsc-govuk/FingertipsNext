import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { getMapJoinKey } from '@/lib/mapUtils/getMapJoinKey';
import { getMapGroupBoundary } from '@/lib/mapUtils/getMapGroupBoundary';

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

  // We don't want to render this page statically
  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const data = await Promise.all(
    indicatorsSelected.map((indicatorId) =>
      indicatorApi.getHealthDataForAnIndicator({
        indicatorId: Number(indicatorId),
        areaCodes: [...areaCodes, areaCodeForEngland],
      })
    )
  );

  let rawPopulationData;
  let preparedPopulationData;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [...areaCodes, areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  if (rawPopulationData) {
    preparedPopulationData = preparePopulationData(
      rawPopulationData,
      areaCodes[0],
      areaCodes[1] // Passing the first two area codes until business logic to select baseline comparator for pop pyramids is added
    );
  }

  let mapData;
  let mapJoinKey;
  let mapGroupBoundary;
  if (selectedAreaType && indicatorsSelected.length === 1) {
    // only checking for selectedAreaType and single indicator until business logic to also confirm when an entire Group of areas has been selected is in place
    mapData = getMapFile(selectedAreaType);
    mapJoinKey = getMapJoinKey(selectedAreaType);
    mapGroupBoundary = getMapGroupBoundary(mapData, areaCodes, mapJoinKey);
  }

  return (
    <Chart
      populationData={preparedPopulationData}
      data={data}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroupBoundary={mapGroupBoundary}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
