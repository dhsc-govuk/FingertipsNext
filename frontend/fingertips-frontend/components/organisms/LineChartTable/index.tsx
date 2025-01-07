'use client';

import { Table } from 'govuk-react';
import { HealthCareData } from '@/app/chart/health-data';
import { orderedValues } from '@/lib/chartHelpers/formatLineChartValues';

interface TableProps {
  data: HealthCareData[];
  headings: string[];
}

export function LineChartTable({ data, headings }: Readonly<TableProps>) {
  data = orderedValues(data)
  return (
    <div data-testid="lineChartTable-component">
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
