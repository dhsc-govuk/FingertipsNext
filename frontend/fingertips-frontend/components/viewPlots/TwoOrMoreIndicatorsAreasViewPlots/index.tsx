'use client';

import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { MultiIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { H2 } from 'govuk-react';

export function TwoOrMoreIndicatorsAreasViewPlot({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<MultiIndicatorViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData[0],
    selectedGroupCode
  );
  const englandBenchmarkData = healthIndicatorData[0].find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? healthIndicatorData[0].find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;

  return <H2>View data for selected indicators and areas</H2>;
}
