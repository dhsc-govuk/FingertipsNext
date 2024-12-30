'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';

type ChartProps = {
  data: HealthCareData[];
  indicator?: string;
};

const headings = ['Area Code', 'Year', 'Count', 'Value', 'LowerCi', 'UpperCi'];

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      <LineChart
        data={data}
        title="Healthcare Data"
        xAxisTitle="Year"
        yAxisTitle="Value"
        accessibilityLabel="A line chart showing weather forecast"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
