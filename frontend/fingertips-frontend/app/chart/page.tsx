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
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import {
  HealthDataForArea,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ViewsContext } from '@/components/views/ViewsContext';

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
      indicatorApi.getHealthDataForAnIndicator({
        indicatorId: Number(indicatorId),
        areaCodes: areaCodesToRequest,
        inequalities: shouldDisplayInequalities(
          indicatorsSelected,
          areasSelected
        )
          ? [GetHealthDataForAnIndicatorInequalitiesEnum.Sex]
          : [],
      })
    )
  );

  let rawPopulationData: HealthDataForArea[] | undefined;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [...areasSelected, areaCodeForEngland],
    });
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

  // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
  const mapDataIsRequired =
    selectedAreaType &&
    indicatorsSelected.length === 1 &&
    areasSelected.length >= 2;

  const mapData = mapDataIsRequired
    ? getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areasSelected)
    : undefined;

  return (
    <>
      <Chart
        populationData={preparedPopulationData}
        healthIndicatorData={healthIndicatorData}
        mapData={mapData}
        searchState={stateManager.getSearchState()}
      />
      <ViewsContext searchState={stateManager.getSearchState()} />;
    </>
  );
}
