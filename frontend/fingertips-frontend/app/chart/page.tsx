import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getApiConfiguration } from '@/lib/getApiConfiguration';
import {
  PopulationData,
  preparePopulationData,
} from '@/lib/chartHelpers/preparePopulationData';

export type PreparedPopulationData = {
  dataForSelectedArea: PopulationData;
  dataForEngland?: PopulationData;
  dataForBaseline?: PopulationData;
};
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';

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

  const populationData = await indicatorApi.getHealthDataForAnIndicator({
    // TODO: define business logic for population data indicator. These are either:
    //  - 92708 (resident population) for adminastrative areas or,
    //  - 93468 (Proportion of GP registered populations by age group) for healthcare areas
    indicatorId: 92708,
    // TODO: define business logic for comparitors (i.e. England and baseline).
    // Suggest England is always fetched on 'E92000001' (is this the same code for both admin and health areas?).
    // How will baseline be defined?
    areaCodes: [areaCodes[0], 'E92000001', 'baselineAreaCode'],
  });

  // mock provides sample popultation data on [0]
  const populationDataForSelectedArea = preparePopulationData(
    populationData[0].healthData
  );
  // faking compartor data
  const populationDataForEngland = preparePopulationData(
    populationData[0].healthData
  );
  const populationDataForBaseline = preparePopulationData(
    populationData[0].healthData
  );

  // setting values for fake data so they don't overlay on plot
  for (const i in populationDataForEngland.ageCategories) {
    populationDataForEngland.femaleSeries[i] = 1;
    populationDataForEngland.maleSeries[i] = -1;
    populationDataForBaseline.femaleSeries[i] = 0.5;
    populationDataForBaseline.maleSeries[i] = -0.5;
  }

  const preparedPopulationData = {
    dataForSelectedArea: populationDataForSelectedArea,
    dataForEngland: populationDataForEngland,
    dataForBaseline: populationDataForBaseline,
  };

  return (
    <Chart
      preparedPopulationData={preparedPopulationData}
      data={data}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
    />
  );
}
