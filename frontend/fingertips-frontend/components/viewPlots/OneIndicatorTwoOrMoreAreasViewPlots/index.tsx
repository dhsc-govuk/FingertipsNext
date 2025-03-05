'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { H2 } from 'govuk-react';

type OneIndicatorTwoOrMoreAreasViewPlotsProps = {
  healthIndicatorData: HealthDataForArea[];
  selectedGroupCode?: string;
  searchState: SearchStateParams;
};

export function OneIndicatorTwoOrMoreAreasViewPlots({
  healthIndicatorData,
  selectedGroupCode,
  searchState,
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  // TODO: LineChart only if 2 areas

  return <H2>View data for selected indicators and areas</H2>;
}
