'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchStateParams } from '@/lib/searchStateManager';
import { H3 } from 'govuk-react';

type OneIndicatorOneAreaDashboardProps = {
  healthIndicatorData: HealthDataForArea[];
  selectedGroupCode?: string;
  searchState: SearchStateParams;
};

export function OneIndicatorOneAreaViewPlots({
  healthIndicatorData,
  selectedGroupCode,
  searchState,
}: OneIndicatorOneAreaDashboardProps) {
  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );
  const englandBenchmarkData = seriesDataForIndicatorIndexAndArea(
    [healthIndicatorData],
    0,
    areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? seriesDataForIndicatorIndexAndArea(
          [healthIndicatorData],
          0,
          selectedGroupCode
        )
      : undefined;
  return (
    <>
      <H3>See how the indicator has changed over time</H3>
      <TabContainer
        id="lineChartAndTable"
        items={[
          {
            id: 'lineChart',
            title: 'Line chart',
            content: (
              <LineChart
                healthIndicatorData={dataWithoutEngland}
                benchmarkData={englandBenchmarkData}
                searchState={searchState}
                groupIndicatorData={groupData}
                xAxisTitle="Year"
                accessibilityLabel="A line chart showing healthcare data"
              />
            ),
          },
          {
            id: 'table',
            title: 'Tabular data',
            content: (
              <LineChartTable
                healthIndicatorData={dataWithoutEngland}
                englandBenchmarkData={englandBenchmarkData}
                groupIndicatorData={groupData}
              />
            ),
          },
        ]}
      />

      <H3>Inequalities Visualisations</H3>
      <H3>Population Visualisations</H3>
    </>
  );
}
