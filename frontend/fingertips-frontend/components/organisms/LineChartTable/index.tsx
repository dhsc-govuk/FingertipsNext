'use client';

import { Table } from 'govuk-react';
import { sortHealthDataByDate } from '@/lib/chartHelpers/formatChartValues';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface TableProps {
  data: HealthDataForArea[];
  headings: string[];
}

export function LineChartTable({ data, headings }: Readonly<TableProps>) {
  data = sortHealthDataByDate(data);
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
                  {item.areaName}
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
