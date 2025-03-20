import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import {
  PopulationData,
  preparePopulationData,
} from '@/lib/chartHelpers/preparePopulationData';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ViewsContext } from '@/components/views/ViewsContext';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { ErrorPage } from '@/components/pages/error';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  try {
    const searchParams = await props.searchParams;
    const stateManager = SearchStateManager.initialise(searchParams);
    const { [SearchParams.AreasSelected]: areaCodes } =
      stateManager.getSearchState();

    const areasSelected = areaCodes ?? [];

    // We don't want to render this page statically
    await connection();

    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

    let rawPopulationData: HealthDataForArea[] | undefined;
    try {
      rawPopulationData = await indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: indicatorIdForPopulation,
          areaCodes: [...areasSelected, areaCodeForEngland],
          inequalities: ['age', 'sex'],
        },
        API_CACHE_CONFIG
      );
    } catch (error) {
      console.log('error getting population data ', error);
    }

    // Passing the first two areas selected until business logic to select baseline comparator for pop pyramids is added
    const preparedPopulationData: PopulationData | undefined = rawPopulationData
      ? preparePopulationData(
          rawPopulationData,
          areasSelected[0],
          areasSelected[1]
        )
      : undefined;

    // Area filtering data
    const areasApi = ApiClientFactory.getAreasApiClient();

    // set England as areas if all other areas are removed
    // DHSCFT-481 to futher refine this behaviour
    if (areasSelected.length === 0) {
      stateManager.addParamValueToState(
        SearchParams.AreasSelected,
        areaCodeForEngland
      );
    }

    const selectedAreasData =
      areasSelected && areasSelected.length > 0
        ? await Promise.all(
            areasSelected.map((area) =>
              areasApi.getArea({ areaCode: area }, API_CACHE_CONFIG)
            )
          )
        : [];

    const {
      availableAreaTypes,
      availableAreas,
      availableGroupTypes,
      availableGroups,
      updatedSearchState,
    } = await getAreaFilterData(
      stateManager.getSearchState(),
      selectedAreasData
    );

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    return (
      <>
        <ViewsContext
          searchState={stateManager.getSearchState()}
          selectedAreasData={selectedAreasData}
          areaFilterData={{
            availableAreaTypes,
            availableGroupTypes,
            availableGroups,
            availableAreas,
          }}
        />
        <Chart populationData={preparedPopulationData} />
      </>
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return <ErrorPage />;
  }
}
