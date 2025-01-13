'use client';
import { H1 } from 'govuk-react';
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
      <H1>Bar Chart</H1>
      <BarChart data={data} yAxisTitle="Value" />
      <BarChartTable data={data} headings={headings} />
    </>
  );
}
