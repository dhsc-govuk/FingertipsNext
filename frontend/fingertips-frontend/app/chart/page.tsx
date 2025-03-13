import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';

import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
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

  return (
    <>
      <ViewsContext searchState={stateManager.getSearchState()} />
      <Chart
        healthIndicatorData={healthIndicatorData}
        mapData={mapData}
        searchState={stateManager.getSearchState()}
        measurementUnit={indicatorMetadata?.unitLabel}
      />
    </>
  );
}
