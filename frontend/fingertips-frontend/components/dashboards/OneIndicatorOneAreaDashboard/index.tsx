'use client';

import { H2, H3 } from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { LineChart } from '@/components/organisms/LineChart';

type OneIndicatorOneAreaDashboardProps = {
  healthIndicatorData: HealthDataForArea[][];
  searchState: SearchStateParams;
};

export function OneIndicatorOneAreaDashboard({
  healthIndicatorData,
  searchState,
}: Readonly<OneIndicatorOneAreaDashboardProps>) {
  return (
    <>
      <H2>View indicator data for the selected area</H2>
      <LineChart
        healthIndicatorData={healthIndicatorData[0]}
        searchState={searchState}
      />
      <H3>Inequalities Visualisations</H3>
      <H3>Population Visualisations</H3>
    </>
  );
}
