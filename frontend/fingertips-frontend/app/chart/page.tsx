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
  HealthDataForArea,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ViewsContext } from '@/components/views/ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
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

  return (
    <>
      <ViewsContext searchState={stateManager.getSearchState()} />
      <Chart
        populationData={preparedPopulationData}
        healthIndicatorData={healthIndicatorData}
        searchState={stateManager.getSearchState()}
        measurementUnit={indicatorMetadata?.unitLabel}
      />
    </>
  );
}
