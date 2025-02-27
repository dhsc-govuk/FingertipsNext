'use client';

import { H2, H3 } from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type TwoOrMoreIndicatorsEnglandDashboardProps = {
  healthIndicatorData: HealthDataForArea[][];
  // populationData: PopulationData;
  searchState: SearchStateParams;
};

export function TwoOrMoreIndicatorsEnglandDashboard({
  healthIndicatorData,
  searchState,
}: TwoOrMoreIndicatorsEnglandDashboardProps) {
  return (
    <>
      <H2>View indicators data for England</H2>
      <H3>Basic Table</H3>
      <H3>Population Visualisations</H3>
    </>
  );
}
