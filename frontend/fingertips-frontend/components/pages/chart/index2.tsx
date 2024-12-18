'use client';

import { LineChart } from '@/components/linechartsOptions';
import { WeatherForecast } from '@/generated-sources/api-client';
import { H1 } from 'govuk-react';

type ChartProps = {
  data: WeatherForecast[];
};

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      {/*<StyledComponentsRegistry>*/}
      {/*  <Table*/}
      {/*    head={*/}
      {/*      <Table.Row>*/}
      {/*        <Table.CellHeader date>Date</Table.CellHeader>*/}
      {/*        <Table.CellHeader numeric>Temperature C</Table.CellHeader>*/}
      {/*        <Table.CellHeader numeric>Temperature F</Table.CellHeader>*/}
      {/*        <Table.CellHeader>Summary</Table.CellHeader>*/}
      {/*      </Table.Row>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    {data.map((item) => (*/}
      {/*      <Table.Row key={`${item.date}-${item.temperatureC}`}>*/}
      {/*        <Table.Cell>{item.date}</Table.Cell>*/}
      {/*        <Table.Cell numeric>{item.temperatureC}</Table.Cell>*/}
      {/*        <Table.Cell numeric>{item.temperatureF}</Table.Cell>*/}
      {/*        <Table.Cell>{item.summary}</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*    ))}*/}
      {/*  </Table>*/}
      {/*</StyledComponentsRegistry>*/}
      <div>
        <LineChart
          data={data}
          title="Weather Forecast"
          xAxisTitle="Date"
          yAxisTitle="Temperature (°C)"
        />
      </div>
    </>
  );
}
