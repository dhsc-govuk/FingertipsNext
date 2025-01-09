'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthCareData } from '@/app/chart/health-data';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';

type ChartProps = {
  data: HealthCareData[];
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      <LineChart
        data={data}
        title="Healthcare Data"
        xAxisTitle="Year"
        yAxisTitle="Value"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
      <PopulationPyramid
        data={data}
        title="Healthcare Data"
        xAxisTitle="Area Code"
        yAxisTitle="Value (unit)"
        accessibilityLabel="A pyramid chart showing some data"
      />
    </>
  );
}
