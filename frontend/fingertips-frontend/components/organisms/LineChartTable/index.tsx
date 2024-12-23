'use client';

import { Table } from 'govuk-react';
import { WeatherForecast } from '@/generated-sources/api-client';

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

interface TableProps {
  data: HealthCareData[];
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
          <Table.Row key={`${item.healthData?.year}`}>
            <Table.Cell>
              {item.healthData?.year}
            </Table.Cell>
            <Table.Cell numeric>{item.healthData?.value}</Table.Cell>
            <Table.Cell numeric>{item.healthData?.count}</Table.Cell>
            <Table.Cell numeric>{item.healthData?.lowerCi}</Table.Cell>
            <Table.Cell numeric>{item.healthData?.upperCi}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
