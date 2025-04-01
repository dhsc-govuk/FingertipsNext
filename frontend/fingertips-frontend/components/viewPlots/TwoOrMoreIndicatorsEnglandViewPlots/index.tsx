'use client';

import { TwoOrMoreIndicatorsEnglandViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  EnglandAreaTypeIndicatorData,
  EnglandAreaTypeTable,
} from '@/components/organisms/EnglandAreaTypeTable';

export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  // const { orderedEnglandData, orderedMetadata } =
  //   extractingIndicatorHealthData(
  //     indicatorData,
  //     indicatorMetadata,
  //   );
  
// console.log('orderedMetadata',orderedMetadata)
// console.log('orderedEnglandData',orderedEnglandData)
  console.log('indicatorData',indicatorData)
  console.log('indicatorMetadata',indicatorMetadata)
//   console.log('searchState',searchState)
  

  
  const englandIndicatorData: EnglandAreaTypeIndicatorData[] = indicatorData.map((indicator) =>{
    const metaDataForIndicator = indicatorMetadata.find((indicatorMeta) => indicatorMeta?.indicatorID === indicator.indicatorId?.toString())
    const latestPeriod = metaDataForIndicator?.latestDataPeriod
    const latestData = indicator.areaHealthData?.[0].healthData?.find((item) => item.year.toString() === latestPeriod )
    console.log('metaDataForIndicator',metaDataForIndicator)
    console.log('latestEnglandHealthData',latestData)
    return {
      indicatorId: indicator.indicatorId,
      indicatorName: indicator.name,
      period: latestPeriod,
      latestEnglandHealthData: latestData,
      unitLabel: metaDataForIndicator?.unitLabel
    }
  })

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <EnglandAreaTypeTable indicator={englandIndicatorData} />
    </section>
  );
}
