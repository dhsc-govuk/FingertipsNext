import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
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
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ViewsContext } from '@/components/views/ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
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
      [SearchParams.AreaTypeSelected]: selectedAreaType,
      [SearchParams.GroupSelected]: selectedGroupCode,
    } = stateManager.getSearchState();

    const areasSelected = areaCodes ?? [];
    const indicatorsSelected = indicators ?? [];

    // We don't want to render this page statically
    await connection();

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
    // Note: This function is having a side effect on the rendering and its causes multi-test to
    // fail if removed. I think ticket to make sure function called does not call a
    // rendering context  and testing should be unit, if you see this code is not used but removing it cause problem on the test.
    const _: HealthDataForArea[] | undefined = await (async () => {
      try {
        return await indicatorApi.getHealthDataForAnIndicator(
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
    })();

    // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
    const mapDataIsRequired =
      selectedAreaType &&
      indicatorsSelected.length === 1 &&
      areasSelected.length >= 2;

    const mapData = mapDataIsRequired
      ? getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areasSelected)
      : undefined;

    let indicatorMetadata: IndicatorDocument | undefined;
    try {
      indicatorMetadata =
        await SearchServiceFactory.getIndicatorSearchService().getIndicator(
          indicatorsSelected[0]
        );
    } catch (error) {
      console.error(
        'error getting meta data for health indicator for area',
        error
      );
    }

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
        <Chart
          healthIndicatorData={healthIndicatorData}
          mapData={mapData}
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
