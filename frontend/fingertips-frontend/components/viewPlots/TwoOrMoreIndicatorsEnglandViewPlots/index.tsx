'use client';

import { H2 } from 'govuk-react';
import {
  TwoOrMoreIndicatorsEnglandViewPlotProps,
} from '@/components/viewPlots/ViewPlotProps';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { EnglandAreaTypeTable } from '@/components/organisms/EnglandAreaTypeTable';

export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  englandIndicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected
  } = stateManager.getSearchState();
  
  // pull indicators through and add to component 
  const indicators = indicatorData
  
  const healthIndicatorData = englandIndicatorData?.areaHealthData ?? [];
  const englandBenchmarkData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );
  
  return (<section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
    
    <H2>View data for selected indicators and areas</H2>
    <EnglandAreaTypeTable englandBenchmarkData={englandBenchmarkData} measurementUnit={indicatorMetadata?.unitLabel} indicators={indicators} />
  </section>)
}
