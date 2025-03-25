import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { extractingCombinedHealthData } from '@/lib/chartHelpers/extractHealthDataForArea';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    !areasSelected ||
    areasSelected?.length < 1 ||
    areasSelected?.length > 2
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
  console.log(areaCodesToRequest)
  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let combinedIndicatorData: HealthDataForArea[][];
  try {
    const promises = indicatorsSelected.map((indicator) => {
      return indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: Number(indicator),
          areaCodes: areaCodesToRequest,
        },
        API_CACHE_CONFIG
      );
    });

    combinedIndicatorData = await Promise.all(promises);
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  console.log(`combinedIndicatorData ${JSON.stringify(combinedIndicatorData, null, 2)}`)
  /*
  const healthIndicatorData: HealthDataForArea[] = new Array(combinedIndicatorData.length);
  const groupIndicatorData: HealthDataForArea[] = new Array(combinedIndicatorData.length);
  const englandIndicatorData: HealthDataForArea[] = new Array(combinedIndicatorData.length);
  combinedIndicatorData.map((indicator,index) => {
    const healthData = indicator.find(
      (areaData) => areaData.areaCode === indicatorsSelected[index]
    );

    if (!healthData){
      throw new Error('Missing health data for indicator')
    }
    healthIndicatorData[index] = healthData

    const groupData = indicator.find(
      (areaData) => areaData.areaCode === selectedGroupCode
    );

    if (!groupData){
      throw new Error('Missing group health data for indicator')
    }
    groupIndicatorData[index] = groupData

    const englandData = indicator.find(
      (areaData) => areaData.areaCode === areaCodeForEngland
    );

    if (!englandData){
      throw new Error('Missing England health data for indicator')
    }
    englandIndicatorData[index] = englandData
  })
  */
  const { healthIndicatorData, groupIndicatorData, englandIndicatorData } =
    extractingCombinedHealthData(
      combinedIndicatorData,
      areasSelected,
      selectedGroupCode
    );

  let indicatorMetadata: (IndicatorDocument | undefined)[];
  try {
    const promises = indicatorsSelected.map((indicator) => {
      return SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicator
      );
    });

    const _ = await Promise.all(promises);
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }

  return (
    <TwoOrMoreIndicatorsAreasViewPlot
      searchState={searchState}
      healthIndicatorData={healthIndicatorData}
      groupIndicatorData={groupIndicatorData}
      englandIndicatorData={englandIndicatorData}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
