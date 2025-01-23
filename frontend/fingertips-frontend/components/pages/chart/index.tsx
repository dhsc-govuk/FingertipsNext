'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H2, BackLink } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { HeatmapChart } from '@/components/organisms/Heatmap';
import { IndicatorRowData } from '@/components/organisms/Heatmap';

type ChartProps = {
  data: HealthDataForArea[];
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
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
            },
            {
              year: 2024,
              count: 13,
              value: 11,
              upperCi: 23,
              lowerCi: 3,
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
            },
            {
              year: 2024,
              count: 9,
              value: 82,
              upperCi: 99,
              lowerCi: 2,
            },
          ],
        },
      ],
    },
  ];
  // End of temporary test data for Heatmap

  const backLinkPath = searchState.generatePath('/search/results');
  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
      <H2>View Dementia QOF prevalence</H2>
      <br />
      <LineChart
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
      <HeatmapChart areaCodes={areaCodes} data={heatmapData}></HeatmapChart>
    </>
  );
}
