'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';

type ChartProps = {
  healthIndicatorData: HealthDataForArea[][];
  populationData?: PopulationData;
  searchState: SearchStateParams;
  measurementUnit?: string;
};

export function Chart({ populationData }: Readonly<ChartProps>) {
  return (
    <>
      {populationData ? (
        <>
          <br />
          <PopulationPyramid
            healthIndicatorData={populationData}
            populationPyramidTitle="Related population data"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
        </>
      ) : null}
    </>
  );
}
