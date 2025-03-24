import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import { chunkArray, maxIndicatorAPIRequestSize } from '@/lib/ViewsHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

export default async function OneIndicatorTwoOrMoreAreasView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = stateManager.getSearchState();

  if (
    indicatorSelected?.length !== 1 ||
    !areasSelected ||
    areasSelected?.length < 2
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = (
      await Promise.all(
        chunkArray(areaCodesToRequest, maxIndicatorAPIRequestSize).map(
          (requestAreas) =>
            indicatorApi.getHealthDataForAnIndicator(
              {
                indicatorId: Number(indicatorSelected[0]),
                areaCodes: [...requestAreas],
                comparisonMethod: 'Rag',
              },
              API_CACHE_CONFIG
            )
        )
      )
    )
      .map((indicatorData) => indicatorData?.areaHealthData ?? [])
      .flat();
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  const indicatorMetadata = selectedIndicatorsData?.[0];

  const mapData =
    selectedGroupArea === ALL_AREAS_SELECTED && selectedAreaType
      ? getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areasSelected)
      : undefined;

  return (
    <OneIndicatorTwoOrMoreAreasViewPlots
      healthIndicatorData={healthIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
      mapData={mapData}
    />
  );
}
