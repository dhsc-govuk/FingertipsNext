'use client';

import { H2, H3 } from 'govuk-react';
import { getChartListForView, IViewProps } from '@/lib/viewUtils/viewUtils';
import { SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { LineChart } from '@/components/organisms/LineChart';

type OnceIndicatorOneAreaDashboardProps = {
  healthIndicatorData: HealthDataForArea[][];
  // populationData: PopulationData;
  searchState: SearchStateParams;
};

export function OnceIndicatorOneAreaDashboard({
  healthIndicatorData,
  searchState,
}: OnceIndicatorOneAreaDashboardProps) {
  // TODO: seperate out and pass data for the areas to LineChart
  // TODO: add inequalities
  // TODO: add population
  return (
    <>
      <p>Backlink? maybe on a layout</p>
      <H2>View data for the selected area</H2>
      <LineChart
        healthIndicatorData={healthIndicatorData[0]}
        searchState={searchState}
      />
      <H3>Inequalities Visualisations</H3>
      <H3>Population Visualisations</H3>
    </>
  );
}
