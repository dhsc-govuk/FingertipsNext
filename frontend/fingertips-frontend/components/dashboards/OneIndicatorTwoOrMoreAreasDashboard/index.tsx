'use client';

import { H2, H3 } from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type OneIndicatorTwoOrMoreAreasDashboard = {
  healthIndicatorData: HealthDataForArea[][];
  // populationData: PopulationData;
  // mapData: MapData;
  searchState: SearchStateParams;
};

export function OneIndicatorTwoOrMoreAreasDashboard({
  healthIndicatorData,
  searchState,
}: OneIndicatorTwoOrMoreAreasDashboard) {
  return (
    <>
      <H2>View data for the selected areas</H2>
      <H3>LineChart IF 2 areas</H3>
      <H3>Inequalities Visualisations</H3>
      <H3>Population Visualisations</H3>
      <H3>Thematic Map IF all areas in group</H3>
    </>
  );
}
