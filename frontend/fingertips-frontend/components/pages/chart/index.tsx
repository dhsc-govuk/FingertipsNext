'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H3 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type ChartProps = {
  data: HealthDataForArea[];
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H3>See how the indicator has changed over time for the area</H3>
      <LineChart
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
