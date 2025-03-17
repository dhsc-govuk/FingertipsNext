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
} from '@/lib/thematicMapUtils/getMapData';

export default async function OneIndicatorTwoOrMoreAreasView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
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
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: areaCodesToRequest,
      },
      API_CACHE_CONFIG
    );
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
    // DHSCFT-483 to restore to selectedGroupArea only
    selectedGroupArea === 'ALL' && selectedGroupCode
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
