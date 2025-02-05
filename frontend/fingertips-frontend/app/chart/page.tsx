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
import { getMapGroup } from '@/lib/mapUtils/getMapGroup';

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

  let rawPopulationData = undefined;
  let preparedPopulationData = undefined;
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

  // Map variables
  // TODO: use areaType from filter
  const areaType: string = 'Counties & UAs';
  // const areaType: string = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  // TODO: replace array with group areaCodes
  const mapGroup = getMapGroup(
    mapData,
    [
      'E08000025',
      'E08000029',
      'E08000030',
      'E08000027',
      'E08000028',
      'E08000031',
      'E08000026',
    ],
    mapJoinKey
  );

  return (
    <Chart
      populationData={preparedPopulationData}
      data={data}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
