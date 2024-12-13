'use client';

import {H1, Table} from 'govuk-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import StyledComponentsRegistry from "@/lib/registry";

interface Response {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface DataProp {
  data: Response[];
}

export function LineChart({ data }: DataProp) {
  const categories = data.map((item) => item.date);
  const temperatureData = data.map((item) => item.temperatureC);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: 'Weather Forecast' },
    xAxis: { categories: categories, title: { text: 'Date' } },
    yAxis: {
      title: { text: 'Temperature (°C)' },
    },
    series: [
      {
        type: 'line',
        name: 'Temperature (°C)',
        data: temperatureData,
      },
    ],
    accessibility: {
      enabled: true,
      description: 'A line chart showing temperature data over 6 months.',
    },
  };
  return (
    <>
      <H1>Line Chart</H1>
      <noscript data-testid="noscript-table">
        <StyledComponentsRegistry>
          <Table
              head={
                <Table.Row>
                  <Table.CellHeader date>Date</Table.CellHeader>
                  <Table.CellHeader numeric>Temperature C</Table.CellHeader>
                  <Table.CellHeader numeric>Temperature F</Table.CellHeader>
                  <Table.CellHeader>Summary</Table.CellHeader>
                </Table.Row>
              }
          >
            {data.map((item) => (
                <Table.Row key={`${item.date}-${item.temperatureC}`}>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell numeric>{item.temperatureC}</Table.Cell>
                  <Table.Cell numeric>{item.temperatureF}</Table.Cell>
                  <Table.Cell>{item.summary}</Table.Cell>
                </Table.Row>
            ))}
          </Table>
          </StyledComponentsRegistry>
      </noscript>
      <div>
        <HighchartsReact
          containerProps={{ 'data-testid': 'highcharts-react-component' }}
          highcharts={Highcharts}
          options={lineChartOptions}
        />
      </div>
    </>
  );
}
