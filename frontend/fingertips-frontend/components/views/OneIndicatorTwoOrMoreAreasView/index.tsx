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
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/chartHelpers/thematicMapHelpers';
import { chunkArray, maxIndicatorAPIRequestSize } from '@/lib/ViewsHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

interface OneIndicatorTwoOrMoreAreasViewProps extends ViewProps {
  areaCodes: string[];
}

export default async function OneIndicatorTwoOrMoreAreasView({
  searchState,
  areaCodes,
}: Readonly<OneIndicatorTwoOrMoreAreasViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = stateManager.getSearchState();

  const areasSelected = areaCodes;
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
    ).flat();
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  let indicatorMetadata: IndicatorDocument | undefined;
  try {
    indicatorMetadata =
      await SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicatorSelected[0]
      );
  } catch (error) {
    console.error(
      'error getting meta data for health indicator for areas',
      error
    );
  }

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
      areaCodes={areaCodes}
    />
  );
}
