'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { HeatmapChart } from '@/components/organisms/Heatmap';
import { IndicatorRowData } from '@/components/organisms/Heatmap';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';

type ChartProps = {
  data: HealthDataForArea[];
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({
    searchedIndicator,
    indicatorsSelected,
  });

  // Temporary test data for Heatmap
  const areaCodes: Array<string> = ['area1', 'area2', 'area3'];
  const heatmapData: Array<IndicatorRowData> = [
    {
      indicator: 'Indicator1',
      year: 2023,
      rowData: [
        {
          areaCode: 'area1',
          healthData: [
            {
              year: 2023,
              count: 3,
              value: 27,
              upperCi: 8,
              lowerCi: 2,
              ageBand: 'ageBand',
              sex: 'M',
            },
          ],
        },
      ],
    },
    {
      indicator: 'Indicator2',
      year: 2024,
      rowData: [
        {
          areaCode: 'area1',
          healthData: [
            {
              year: 2023,
              count: 5,
              value: 33,
              upperCi: 18,
              lowerCi: 9,
              ageBand: 'ageBand',
              sex: 'M',
            },
            {
              year: 2024,
              count: 13,
              value: 11,
              upperCi: 23,
              lowerCi: 3,
              ageBand: 'ageBand',
              sex: 'M',
            },
          ],
        },
        {
          areaCode: 'area2',
          healthData: [
            {
              year: 2019,
              count: 3,
              value: 27,
              upperCi: 8,
              lowerCi: 2,
              ageBand: 'ageBand',
              sex: 'M',
            },
            {
              year: 2024,
              count: 9,
              value: 82,
              upperCi: 99,
              lowerCi: 2,
              ageBand: 'ageBand',
              sex: 'M',
            },
          ],
        },
      ],
    },
  ];
  // End of temporary test data for Heatmap

  const backLinkPath = searchState.generatePath('/results');

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <H2>View Dementia QOF prevalence</H2>
      {populationData ? (
        <>
          <PopulationPyramid
            data={populationData}
            populationPyramidTitle="Population INDICATOR for SELECTED area"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
          <br />
        </>
      ) : null}
      <LineChart
        LineChartTitle="Line chart to show how the indicator has changed over time for the area"
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <br />
      <BarChart
        data={data}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
      />
      <br />
      <LineChartTable data={data} headings={headings}></LineChartTable>
      <br />
      <HeatmapChart
        areaCodes={areaCodes}
        data={heatmapData}
        accessibilityLabel="A heatmap chart showing healthcare data"
      />
    </>
  );
}
