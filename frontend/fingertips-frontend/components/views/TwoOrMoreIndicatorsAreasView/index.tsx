import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
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
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
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

  const getHealthDataForIndicator = async (indicatorId: string) => {
    let indicatorData: IndicatorWithHealthDataForArea | undefined;

    const indicatorRequestArray = chunkArray(areasSelected).map(
      (requestAreas) =>
        indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: Number(indicatorId),
            areaCodes: [...requestAreas],
            areaType: selectedAreaType,
          },
          API_CACHE_CONFIG
        )
    );

    if (!areasSelected.includes(areaCodeForEngland)) {
      indicatorRequestArray.push(
        indicatorApi.getHealthDataForAnIndicator(
          {
            indicatorId: Number(indicatorId),
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
            indicatorId: Number(indicatorId),
            areaCodes: [selectedGroupCode],
            areaType: selectedGroupType,
          },
          API_CACHE_CONFIG
        )
      );
    }

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
        `error getting health indicator data for areas : ${error}`
      );
    }

    return indicatorData;
  };

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicator);
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
