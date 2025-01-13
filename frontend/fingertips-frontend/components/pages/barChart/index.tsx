'use client';
import { H3 } from 'govuk-react';
import { BarChart } from '@/components/organisms/BarChart';
import { BarChartTable } from '@/components/organisms/BarChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

type BarChartProps = {
  data: HealthDataForArea[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Bar({ data }: Readonly<BarChartProps>) {
  return (
    <>
      <H3>
        See how inequalities vary for a single period in time for the area
      </H3>
      <BarChart data={data} yAxisTitle="Value" />
      <BarChartTable data={data} headings={headings} />
    </>
  );
}
