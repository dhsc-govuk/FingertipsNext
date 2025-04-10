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
  allowedAreaTypeMapMetaKeys,
  AreaTypeKeysForMapMeta,
  getMapGeographyData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { chunkArray } from '@/lib/ViewsHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

export default async function OneIndicatorTwoOrMoreAreasView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(areasSelected);

  if (indicatorSelected?.length !== 1 || !areaCodes || areaCodes?.length < 2) {
    throw new Error('Invalid parameters provided to view');
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorData: IndicatorWithHealthDataForArea | undefined;

  const indicatorRequestArray = chunkArray(areaCodes).map((requestAreas) =>
    indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: [...requestAreas],
        areaType: selectedAreaType,
      },
      API_CACHE_CONFIG
    )
  );

  if (!areaCodes.includes(areaCodeForEngland)) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [areaCodeForEngland],
          areaType: englandAreaType.key,
        },
        API_CACHE_CONFIG
      )
    );
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    indicatorRequestArray.push(
      indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicatorSelected[0]),
          areaCodes: [selectedGroupCode],
          areaType: selectedGroupType,
        },
        API_CACHE_CONFIG
      )
    );
  }

  try {
    const healthIndicatorDataChunks = await Promise.all(indicatorRequestArray);
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
      ? await getMapGeographyData(
          selectedAreaType as AreaTypeKeysForMapMeta,
          areaCodes
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
