'use client';

import { Table } from 'govuk-react';
import { WeatherForecast } from '@/generated-sources/api-client';

interface TableProps {
  data: WeatherForecast[];
  headings: string[];
}

export function LineChartTable({ data, headings }: Readonly<TableProps>) {
  return (
    <div data-testid="lineChartTable-component">
      <Table
        head={
          <Table.Row>
            {headings?.map((heading, index) => (
              <Table.CellHeader key={index}>{heading}</Table.CellHeader>
            ))}
          </Table.Row>
        }
      >
        {data.map((item) => (
          <Table.Row key={`${item.date}-${item.temperatureC}`}>
            <Table.Cell>
              {item.date?.toLocaleDateString('en-GB') ?? ''}
            </Table.Cell>
            <Table.Cell numeric>{item.temperatureC}</Table.Cell>
            <Table.Cell numeric>{item.temperatureF}</Table.Cell>
            <Table.Cell>{item.summary}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
