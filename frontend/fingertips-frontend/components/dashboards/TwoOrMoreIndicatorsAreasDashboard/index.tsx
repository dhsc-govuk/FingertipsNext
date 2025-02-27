'use client';

import { H2, H3 } from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type TwoOrMoreIndicatorsAreasDashboardProps = {
  healthIndicatorData: HealthDataForArea[][];
  searchState: SearchStateParams;
};

export function TwoOrMoreIndicatorsAreasDashboard() {
  return (
    <>
      <H2>View indicators data for the selected area(s)</H2>
      <H3>Spine Chart</H3>
      <H3>Heatmap</H3>
      <H3>Population Visualisations</H3>
    </>
  );
}
