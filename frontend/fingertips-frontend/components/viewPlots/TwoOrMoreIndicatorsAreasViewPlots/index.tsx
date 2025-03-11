'use client';

import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { ViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { H2 } from 'govuk-react';

export function TwoOrMoreIndicatorsAreasViewPlot({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<ViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );
  const englandBenchmarkData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? healthIndicatorData.find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;


  return <H2>View data for selected indicators and areas</H2>;
}
