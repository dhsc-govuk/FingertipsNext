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
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  chunkArray,
  maxNumAreasThatCanBeRequestedAPI,
} from '@/lib/ViewsHelpers';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export interface QuartileData {
  indicatorId: number;
  polarity: IndicatorPolarity;
  q0Value: number;
  q1Value: number;
  q2Value: number;
  q3Value: number;
  q4Value: number;
  areaValue: number;
  ancestorValue: number;
  englandValue: number;
}

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
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

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }

  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const getHealthDataForIndicator = async (indicatorId: string) => {
    let healthIndicatorData: IndicatorWithHealthDataForArea | undefined;
    try {
      const healthIndicatorDataChunks = await Promise.all(
        chunkArray(areaCodesToRequest, maxNumAreasThatCanBeRequestedAPI).map(
          (requestAreas) =>
            indicatorApi.getHealthDataForAnIndicator(
              {
                indicatorId: Number(indicatorId),
                areaCodes: [...requestAreas],
              },
              API_CACHE_CONFIG
            )
        )
      );

      healthIndicatorData = healthIndicatorDataChunks[0];
      if (!healthIndicatorData.indicatorId) {
        healthIndicatorData.indicatorId = Number(indicatorId);
      }

      healthIndicatorData.areaHealthData = healthIndicatorDataChunks
        .map((indicatorData) => indicatorData?.areaHealthData ?? [])
        .flat();
    } catch (error) {
      throw new Error(
        `error getting health indicator data for areas: ${error}`
      );
    }

    return healthIndicatorData;
  };

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicator);
    })
  );

  return (
    <TwoOrMoreIndicatorsAreasViewPlot
      searchState={searchState}
      indicatorData={combinedIndicatorData}
      indicatorMetadata={selectedIndicatorsData}
    />
  );
}
