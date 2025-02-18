import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  // const searchedIndicator = searchParams?.[SearchParams.SearchedIndicator];
  // const indicatorsSelected = asArray(
  //   searchParams?.[SearchParams.IndicatorsSelected]
  // );
  // const areaCodes = asArray(searchParams?.[SearchParams.AreasSelected]);
  // const selectedAreaType = searchParams?.[SearchParams.AreaTypeSelected];
  const stateManager = SearchStateManager.initialise(searchParams);
  let {
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.ConfidenceIntervalSelected]: confidenceIntervalSelected,
  } = stateManager.getSearchState();

  areaCodes = areaCodes ?? []
  indicatorsSelected = indicatorsSelected ?? []
  
  // We don't want to render this page statically
  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const healthIndicatorData = await Promise.all(
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
  if (
    selectedAreaType &&
    indicatorsSelected?.length === 1 &&
    areaCodes.length >= 2
  ) {
    // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
    mapData = getMapData(selectedAreaType, areaCodes);
  }

  return (
    <Chart
      populationData={preparedPopulationData}
      healthIndicatorData={healthIndicatorData}
      mapData={mapData}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
      areasSelected={areaCodes}
      confidenceIntervalSelected={confidenceIntervalSelected}
    />
  );
}
