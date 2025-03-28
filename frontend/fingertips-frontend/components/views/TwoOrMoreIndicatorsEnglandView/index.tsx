import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { API_CACHE_CONFIG, ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.AreasSelected]: areasSelected, [SearchParams.IndicatorsSelected]: indicatorsSelected, } =
    stateManager.getSearchState();

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    areasSelected?.length !== 1 &&
    areasSelected?.[0] !== areaCodeForEngland
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [areaCodeForEngland];

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const combinedIndicatorData: HealthDataForArea[][] = [];
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

    const results = await Promise.all(promises);

    results.forEach((row) => {
      if (row.areaHealthData) {
        combinedIndicatorData.push(row.areaHealthData);
      }
    });
  } catch (error) {
    console.error('error getting health indicator data for areas', error);
    throw new Error('error getting health indicator data for areas');
  }
  
  // for each indicator -heres the health data
  // second call indicator meta data
  // object structure 
// 
//   const { healthIndicatorData, englandIndicatorData } =
//     extractingCombinedHealthData(
//       combinedIndicatorData,
//       areasSelected,
//       selectedGroupCode
//     );

  // let indicatorMetadata: (IndicatorDocument | undefined)[];
  // try {
  //   const promises = indicatorsSelected.map((indicator) => {
  //     return SearchServiceFactory.getIndicatorSearchService().getIndicator(
  //       indicator
  //     );
  //   });
  //
  //   const results = await Promise.all(promises);
  //
  //   indicatorMetadata = results;
  // } catch (error) {
  //   console.error('error getting health indicator data for areas', error);
  //   throw new Error('error getting health indicator data for areas');
  // }
  
  

  console.log('TODO: fetch health data with inequalites');
  console.log(`TODO: fetch population data for areas: [${areaCodesToRequest}]`);

  return <TwoOrMoreIndicatorsEnglandViewPlots />;
}
