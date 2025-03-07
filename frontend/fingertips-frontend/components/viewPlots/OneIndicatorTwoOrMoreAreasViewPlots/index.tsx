'use client';

import { H2 } from 'govuk-react';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import { SearchParams, SearchStateManager, SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type OneIndicatorTwoOrMoreAreasViewPlotsProps = {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
}
export function OneIndicatorTwoOrMoreAreasViewPlots({healthIndicatorData, searchState,}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.GroupSelected]: selectedGroupCode } =
    stateManager.getSearchState();
  
  return (
    <section data-testid={"oneIndicatorTwoOrMoreAreasViewPlot-component"}><H2>View data for selected indicators and areas</H2>
  <BarChartEmbeddedTable healthIndicatorData={healthIndicatorData}></BarChartEmbeddedTable>
  </section>
  );
}
