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

  // TODO: add business logic for when to have a map: 'Display Map on charts page when an entire Group of areas has been selected AND a single indicator'
  // example url: http://localhost:3000/chart?si=mortality&is=108&ats=Counties+%26+UAs&as=E08000025&as=E08000029&as=E08000030&as=E08000027&as=E08000028&as=E08000031&as=E08000026
  let mapData = undefined;
  let mapJoinKey = undefined;
  let mapGroup = undefined;
  if (selectedAreaType) {
    mapData = getMapFile(selectedAreaType);
    mapJoinKey = getMapJoinKey(selectedAreaType);
    mapGroup = getMapGroup(mapData, areaCodes, mapJoinKey);
  }

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
