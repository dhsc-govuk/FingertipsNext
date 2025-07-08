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
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { lineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeRequestParams';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { compareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableRequestParams';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';
import { inequalitiesIsRequired } from '@/components/charts/Inequalities/helpers/inequalitiesIsRequired';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';

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

    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

    // if we want to show the line chart data then load that now server side
    // and seed the cache - this will help with progressive enhancement and
    // coping with devices that do not have javascript enabled by seeding
    // the data react query can still proceed with data loaded on the server
    // TODO: 1039 - change seed for unpublished
    if (lineChartOverTimeIsRequired(searchState)) {
      let healthData: IndicatorWithHealthDataForArea | undefined;
      const apiRequestParams = lineChartOverTimeRequestParams(searchState);
      try {
        healthData = await indicatorApi.getHealthDataForAnIndicator(
          apiRequestParams,
          API_CACHE_CONFIG
        );

        // store data in query cache
        const queryKeyLineChart = queryKeyFromRequestParams(
          EndPoints.HealthDataForAnIndicator,
          apiRequestParams
        );
        seedData[queryKeyLineChart] = healthData;
      } catch (error) {
        console.error('error getting health indicator data for area', error);
      }
    }

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

    seedData[`availableAreas`] = availableAreas ?? [];

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    const compareAreasQueryParams = compareAreasTableRequestParams(
      searchState,
      availableAreas ?? []
    );
    const compareAreasQueryKey = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      compareAreasQueryParams
    );

    if (
      compareAreasTableIsRequired(searchState) &&
      !Object.keys(seedData).includes(compareAreasQueryKey)
    ) {
      try {
        const compareAreasHealthData =
          await indicatorApi.getHealthDataForAnIndicator(
            compareAreasQueryParams,
            API_CACHE_CONFIG
          );
        seedData[compareAreasQueryKey] = compareAreasHealthData;
      } catch (e) {
        console.error(
          'error getting health indicator data for compare areas',
          e
        );
      }
    }

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
        seedData[inequalitiesQueryKey] =
          await indicatorApi.getHealthDataForAnIndicator(
            inequalitiesQueryParams,
            API_CACHE_CONFIG
          );
      } catch (e) {
        console.error(
          'error getting health indicator data for inequalities',
          e
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
