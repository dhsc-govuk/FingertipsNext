'use client';

import { Table } from 'govuk-react';
interface HealthCareData {
  areaCode: string;
  healthData: {
    year: number;
    count: number;
    value: number;
    lowerCi: number;
    upperCi: number;
  }[];
}

interface TableProps {
  data: HealthCareData[];
  headings: string[];
}

export function BarChartTable({ data, headings }: Readonly<TableProps>) {
  return (
    <div data-testid="barChartTable-component">
      <Table
        head={
          <Table.Row>
            {headings?.map((heading) => (
              <Table.CellHeader key={`header-${heading}`}>
                {heading}
              </Table.CellHeader>
            ))}
          </Table.Row>
        }
      >
        {data.map((item) =>
          item.healthData.map((point, index) => (
            <Table.Row key={`${item.areaCode}-${point.year}--${index}`}>
              {index === 0 && (
                <Table.Cell rowSpan={item.healthData.length}>
                  {item.areaCode}
                </Table.Cell>
              )}
              <Table.Cell numeric>{point.year}</Table.Cell>
              <Table.Cell numeric>{point.value}</Table.Cell>
              <Table.Cell numeric>{point.count}</Table.Cell>
              <Table.Cell numeric>{point.lowerCi}</Table.Cell>
              <Table.Cell numeric>{point.upperCi}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table>
    </div>
  );
}
