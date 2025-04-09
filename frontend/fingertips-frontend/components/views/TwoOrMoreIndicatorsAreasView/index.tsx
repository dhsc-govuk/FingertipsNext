import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import {
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { chunkArray } from '@/lib/ViewsHelpers';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
  } = stateManager.getSearchState();

  if (!indicatorsSelected || indicatorsSelected.length < 2) {
    throw new Error('invalid indicators selected passed to view');
  }

  if (!areasSelected || areasSelected.length < 1) {
    throw new Error('invalid areas selected passed to view');
  }

  if (
    !selectedIndicatorsData ||
    selectedIndicatorsData.length !== indicatorsSelected.length
  ) {
    throw new Error('invalid indicator metadata passed to view');
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  type healthDataRequestAreas = {
    areaCodes: string[];
    areaType?: string;
  };

  const requestAreas: healthDataRequestAreas[] = [
    {
      areaCodes: areasSelected,
      areaType: selectedAreaType,
    },
  ];

  if (!areasSelected.includes(areaCodeForEngland)) {
    requestAreas.push({
      areaCodes: [areaCodeForEngland],
      areaType: englandAreaType.key,
    });
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    requestAreas.push({
      areaCodes: [selectedGroupCode],
      areaType: selectedGroupType,
    });
  }

  const getHealthDataForIndicator = async (
    indicatorApi: IndicatorsApi,
    indicatorId: string,
    requestAreas: healthDataRequestAreas[]
  ): Promise<IndicatorWithHealthDataForArea> => {
    let indicatorData: IndicatorWithHealthDataForArea | undefined;

    const indicatorRequestArray = requestAreas.flatMap((requestArea) => {
      return chunkArray(requestArea.areaCodes).map((areaCodes) =>
        indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: Number(indicatorId),
            areaCodes: [...areaCodes],
            areaType: requestArea.areaType,
          },
          API_CACHE_CONFIG
        )
      );
    });

    try {
      const healthIndicatorDataChunks = await Promise.all(
        indicatorRequestArray
      );

      indicatorData = healthIndicatorDataChunks[0];
      indicatorData.areaHealthData = healthIndicatorDataChunks
        .map((indicatorData) => indicatorData?.areaHealthData ?? [])
        .flat();
    } catch (error) {
      throw new Error(
        `error getting health indicator data for areas: ${error}`
      );
    }

    return indicatorData;
  };

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicatorApi, indicator, requestAreas);
    })
  );

  const indicatorList = indicatorsSelected.map((indicatorAsAString) => {
    return Number(indicatorAsAString);
  });

  const benchmarkQuartiles = await indicatorApi.indicatorsQuartilesGet(
    {
      indicatorIds: indicatorList,
      areaCode: areasSelected[0],
      ancestorCode: selectedGroupCode ?? areaCodeForEngland,
      areaType: selectedAreaType,
    },
    API_CACHE_CONFIG
  );

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={combinedIndicatorData}
    >
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={combinedIndicatorData}
        indicatorMetadata={selectedIndicatorsData}
        benchmarkStatistics={benchmarkQuartiles}
        searchState={searchState}
      />
    </ViewsWrapper>
  );
}
