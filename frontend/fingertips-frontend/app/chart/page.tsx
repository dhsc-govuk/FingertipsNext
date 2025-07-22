import { connection } from 'next/server';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { getSelectedAreasDataByAreaType } from '@/lib/areaFilterHelpers/getSelectedAreasData';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import { ViewsContext } from '@/components/views/ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { ErrorPage } from '@/components/pages/error';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';
import { inequalitiesIsRequired } from '@/components/charts/Inequalities/helpers/inequalitiesIsRequired';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';
import { populationPyramidRequestParams } from '@/components/charts/PopulationPyramid/helpers/populationPyramidRequestParams';
import { getAuthorisedHealthDataForAnIndicator } from '../../lib/chartHelpers/getAuthorisedHealthDataForAnIndicator';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  // We don't want to render this page statically
  await connection();

  try {
    const searchParams = await props.searchParams;
    const stateManager = SearchStateManager.initialise(searchParams);
    const searchState = stateManager.getSearchState();
    const {
      [SearchParams.AreasSelected]: areaCodes,
      [SearchParams.IndicatorsSelected]: indicatorsSelected,
      [SearchParams.AreaTypeSelected]: areaTypeSelected,
    } = searchState;

    const areasSelected = areaCodes ?? [];

    const selectedIndicatorsData =
      indicatorsSelected && indicatorsSelected.length > 0
        ? (
            await Promise.all(
              indicatorsSelected.map((indicator) =>
                SearchServiceFactory.getIndicatorSearchService().getIndicator(
                  indicator
                )
              )
            )
          ).filter((indicatorDocument) => indicatorDocument !== undefined)
        : [];

    // store all loaded indicators in the query cache
    const seedData: SeedData = {};
    selectedIndicatorsData.forEach((indicator) => {
      seedData[`/indicator/${indicator.indicatorID}`] = indicator;
    });

    const selectedAreasData = await getSelectedAreasDataByAreaType(
      areasSelected,
      areaTypeSelected as AreaTypeKeys
    );

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

    // if we want to show the line chart or compare areas bar chart data then
    // load that now server side and seed the cache - this will help with
    // progressive enhancement and coping with devices that do not have
    // javascript enabled by seeding the data react query can still proceed
    // with data loaded on the server
    if (
      lineChartOverTimeIsRequired(searchState) ||
      compareAreasTableIsRequired(searchState)
    ) {
      const apiRequestParams = oneIndicatorRequestParams(
        searchState,
        availableAreas ?? []
      );
      const queryKeyLineChart = queryKeyFromRequestParams(
        EndPoints.HealthDataForAnIndicator,
        apiRequestParams
      );
      try {
        const healthData =
          await getAuthorisedHealthDataForAnIndicator(apiRequestParams);
        seedData[queryKeyLineChart] = healthData;
      } catch (error) {
        console.error('error getting health indicator data for area', error);
      }
    }

    // seed availableAreas
    seedData[`availableAreas`] = availableAreas ?? [];

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    // seed data for inequalities
    const inequalitiesQueryParams = inequalitiesRequestParams(searchState);
    const inequalitiesQueryKey = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      inequalitiesQueryParams
    );
    if (
      inequalitiesIsRequired(searchState) &&
      !Object.keys(seedData).includes(inequalitiesQueryKey)
    ) {
      try {
        const healthData = await getAuthorisedHealthDataForAnIndicator(
          inequalitiesQueryParams
        );
        seedData[inequalitiesQueryKey] = healthData;
      } catch (error) {
        console.error(
          'error getting health indicator data for inequalities',
          error
        );
      }
    }

    // seed data for population pyramid
    // DHSC1160: implement unpublished data
    const populationPyramidQueryParams = populationPyramidRequestParams(
      searchState,
      availableAreas ?? []
    );
    const populationPyramidQueryKey = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      populationPyramidQueryParams
    );
    if (!Object.keys(seedData).includes(populationPyramidQueryKey)) {
      try {
        const healthData = await getAuthorisedHealthDataForAnIndicator(
          populationPyramidQueryParams
        );
        seedData[populationPyramidQueryKey] = healthData;
      } catch (error) {
        console.error(
          'error getting health indicator data for population pyramid',
          error
        );
      }
    }

    return (
      <>
        <SeedQueryCache seedData={seedData} />
        <ViewsContext
          searchState={stateManager.getSearchState()}
          selectedAreasData={selectedAreasData}
          selectedIndicatorsData={selectedIndicatorsData}
          areaFilterData={{
            availableAreaTypes,
            availableGroupTypes,
            availableGroups,
            availableAreas,
          }}
        />
      </>
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return <ErrorPage />;
  }
}
