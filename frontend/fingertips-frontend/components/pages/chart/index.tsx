'use client';

import { LineChart } from '@/components/linechartsOptions';
import { WeatherForecast } from '@/generated-sources/api-client';
import {H1} from 'govuk-react';
import {PlainTable,} from '@/components/table';

type ChartProps = {
  data: WeatherForecast[];
};

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      <div>
        <LineChart
          data={data}
          title="Weather Forecast"
          xAxisTitle="Date"
          yAxisTitle="Temperature (°C)"
        />
      </div>
        <div>
            <PlainTable data={data}></PlainTable>
        </div>
    </>
  );
}
