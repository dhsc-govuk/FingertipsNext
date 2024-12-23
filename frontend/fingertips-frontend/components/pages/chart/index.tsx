'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { WeatherForecast } from '@/generated-sources/api-client';
import { H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';

interface HealthCareData {
  areaCode: string;   
  healthData: {     
    year: number;     
    count: number;     
    value: number;     
    lowerCi: number;     
    upperCi: number;   
  };
}

type ChartProps = {
  data: HealthCareData[];
};

const headings = ['Year', 'Count', 'Value', 'LowerCi', 'UpperCi'];

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      <LineChart
        data={data}
        title="HealthCare Data"
        xAxisTitle="Year"
        yAxisTitle="Value"
        accessibilityLabel="A line chart showing weather forecast"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
