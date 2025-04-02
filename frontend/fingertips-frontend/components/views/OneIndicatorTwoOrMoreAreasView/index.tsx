import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeysForMapMeta,
  getMapGeographyData,
  allowedAreaTypeMapMetaKeys,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import {
  chunkArray,
  maxNumAreasThatCanBeRequestedAPI,
} from '@/lib/ViewsHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';

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
  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  try {
    const healthIndicatorDataChunks = await Promise.all(
      chunkArray(areaCodesToRequest, maxNumAreasThatCanBeRequestedAPI).map(
        (requestAreas) =>
          indicatorApi.getHealthDataForAnIndicator(
            {
              indicatorId: Number(indicatorSelected[0]),
              areaCodes: [...requestAreas],
            },
            API_CACHE_CONFIG
          )
      )
    );
    indicatorData = healthIndicatorDataChunks[0];
    indicatorData.areaHealthData = healthIndicatorDataChunks
      .map((indicatorData) => indicatorData?.areaHealthData ?? [])
      .flat();
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  const indicatorMetadata = selectedIndicatorsData?.[0];
  const mapGeographyData =
    selectedGroupArea === ALL_AREAS_SELECTED &&
    allowedAreaTypeMapMetaKeys.includes(
      selectedAreaType as AreaTypeKeysForMapMeta
    )
      ? getMapGeographyData(
          selectedAreaType as AreaTypeKeysForMapMeta,
          areasSelected
        )
      : undefined;

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={[indicatorData]}
    >
      <OneIndicatorTwoOrMoreAreasViewPlots
        indicatorData={indicatorData}
        searchState={searchState}
        indicatorMetadata={indicatorMetadata}
        mapGeographyData={mapGeographyData}
      />
    </ViewsWrapper>
  );
}
