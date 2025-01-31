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
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicatorsSelected[0]),
    areaCodes: [...areaCodes, areaCodeForEngland],
  });

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
      areaCodes[1] // Passing the first two area codes until business logic to select baseline comparison for pop pyramids is added
    );
  }

  const englandBenchmarkData = data.find(
    (area) => area.areaCode === areaCodeForEngland
  );

  return (
    <Chart
      populationData={preparedPopulationData}
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
      englandBenchmarkData={englandBenchmarkData}
    />
  );
}
