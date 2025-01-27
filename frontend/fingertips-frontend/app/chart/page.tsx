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
    areaCodes: areaCodes,
  });

  let rawPopulationData = undefined;
  let preparedPopulationData = undefined;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [areaCodes[0], areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  if (rawPopulationData) {
    // hardcode selected area data for mocks while no population data is in the database
    preparedPopulationData = preparePopulationData(rawPopulationData, '1', '2');
  }

  return (
    <Chart
      populationData={preparedPopulationData}
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
