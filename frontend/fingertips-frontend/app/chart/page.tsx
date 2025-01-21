import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';

import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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

  const config = getApiConfiguration();
  const indicatorApi = new IndicatorsApi(config);
  const data = await indicatorApi.getHealthDataForAnIndicator({
    indicatorId: Number(indicatorsSelected[0]),
    areaCodes: areaCodes,
  });

  let rawPopulationData = undefined;
  let preparedPopulationData = undefined;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: 92708,
      areaCodes: [areaCodes[0], areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  if (rawPopulationData) {
    // hardcode selected area data for mocks
    preparedPopulationData = preparePopulationData(rawPopulationData, '1', '2');
  }
  // // setting values for fake data so they don't overlay on plot
  // for (const i in populationDataForEngland.ageCategories) {
  //   populationDataForEngland.femaleSeries[i] = 1;
  //   populationDataForEngland.maleSeries[i] = -1;
  //   populationDataForBaseline.femaleSeries[i] = 0.5;
  //   populationDataForBaseline.maleSeries[i] = -0.5;
  // }

  return (
    <Chart
      preparedPopulationData={preparedPopulationData}
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
