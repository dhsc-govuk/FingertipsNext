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

  // Map variables
  // TODO add business logic for when to have a map
  // 'Display Map on charts page when an entire Group of areas has been selected AND a single indicator'
  // &ats=Counties+%26+UAs
  let mapData = undefined;
  let mapJoinKey = undefined;
  let mapGroup = undefined;
  if (selectedAreaType) {
    // const areaType: string = 'Counties & UAs';
    // const areaType: string = 'Regions Statistical';
    mapData = getMapFile(selectedAreaType);
    mapJoinKey = getMapJoinKey(selectedAreaType);
    // TODO: replace array with group areaCodes
    mapGroup = getMapGroup(
      mapData,
      // areaCodes,
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
