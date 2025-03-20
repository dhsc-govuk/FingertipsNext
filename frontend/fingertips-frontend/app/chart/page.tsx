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
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ViewsContext } from '@/components/views/ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
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
    const {
      [SearchParams.IndicatorsSelected]: indicators,
      [SearchParams.AreasSelected]: areaCodes,
      [SearchParams.GroupSelected]: selectedGroupCode,
    } = stateManager.getSearchState();

    const areasSelected = areaCodes ?? [];
    const indicatorsSelected = indicators ?? [];

    // We don't want to render this page statically
    await connection();

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

    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

    const areaCodesToRequest =
      selectedGroupCode && selectedGroupCode != areaCodeForEngland
        ? [...areasSelected, areaCodeForEngland, selectedGroupCode]
        : [...areasSelected, areaCodeForEngland];

    const healthIndicatorData = await Promise.all(
      indicatorsSelected.map((indicatorId) =>
        indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: Number(indicatorId),
            areaCodes: areaCodesToRequest,
            inequalities: shouldDisplayInequalities(
              indicatorsSelected,
              areasSelected
            )
              ? [GetHealthDataForAnIndicatorInequalitiesEnum.Sex]
              : [],
            comparisonMethod:
              GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
          },
          API_CACHE_CONFIG
        )
      )
    );

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

    const indicatorMetadata = selectedIndicatorsData[0];

    // Area filtering data
    const areasApi = ApiClientFactory.getAreasApiClient();

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
          selectedIndicatorsData={selectedIndicatorsData}
          areaFilterData={{
            availableAreaTypes,
            availableGroupTypes,
            availableGroups,
            availableAreas,
          }}
        />
        <Chart
          populationData={preparedPopulationData}
          healthIndicatorData={healthIndicatorData}
          searchState={stateManager.getSearchState()}
          measurementUnit={indicatorMetadata?.unitLabel}
        />
      </>
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return <ErrorPage />;
  }
}
