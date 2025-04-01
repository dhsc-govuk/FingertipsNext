'use client';

import { H2 } from 'govuk-react';
import { TwoOrMoreIndicatorsEnglandViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  EnglandAreaTypeTable,
} from '@/components/organisms/EnglandAreaTypeTable';
import { extractingIndicatorHealthData } from '@/lib/chartHelpers/extractingIndicatorHealthData';
import {
  Indicator,
} from '@/generated-sources/ft-api-client';


export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  const { orderedEnglandData, orderedMetadata } =
    extractingIndicatorHealthData(
      indicatorData,
      indicatorMetadata,
    );
  
// console.log('orderedMetadata',orderedMetadata)
//   console.log('orderedEnglandData',orderedEnglandData)
//   console.log('indicatorData',indicatorData)
//   console.log('indicatorMetadata',indicatorMetadata)
//   console.log('searchState',searchState)
  
  const indicatorInfo: (Indicator | undefined)[] =  orderedMetadata.map((item) => ({
    indicatorId: item?.indicatorID,
    title: item?.indicatorName,
    definition: item?.indicatorDefinition
  }));

console.log('indicatorInfo',indicatorInfo)

  const measurementUnit =
    orderedMetadata.map((item) => (
       item?.unitLabel
    ));

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <EnglandAreaTypeTable englandBenchmarkData={orderedEnglandData} indicator={indicatorInfo} measurementUnit={measurementUnit} />
    </section>
  );
}
