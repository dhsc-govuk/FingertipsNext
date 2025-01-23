'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';

interface TableProps {
  data: HealthDataForArea;
  headings: string[];
}

interface LineChartTableData {
  period: number;
  count: number;
  value: number;
  lower: number;
  upper: number;
}

const StyledAlignCenterHeader = styled(Table.CellHeader)({
  textAlign: 'center',
  padding: '0.3125em',
});

const StyledAlignRightHeader = styled(Table.CellHeader)({
  textAlign: 'right',
  paddingTop: '0',
});

const StyledTable = styled(Table)({
  marginBottom: '0.9375em',
});

const StyledTableCell = styled(Table.Cell)({
  textAlign: 'left',
});

const mapToTableData = (areaData: HealthDataForArea): LineChartTableData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

export function LineChartTable({ data, headings }: Readonly<TableProps>) {
  const tableData = mapToTableData(data);
  tableData.sort((a, b) => b.period - a.period);
  return (
    <div data-testid="lineChartTable-component">
      <StyledTable
        head={
          <Table.Row>
            <StyledAlignCenterHeader setWidth="three-quarters">
              {data.areaCode}
            </StyledAlignCenterHeader>
            <StyledAlignRightHeader setWidth="one-quarter">
              England
            </StyledAlignRightHeader>
          </Table.Row>
        }
      ></StyledTable>
      <StyledTable
        head={
          <Table.Row>
            <StyledAlignRightHeader setWidth="three-quarters">
              95% confidence limits
            </StyledAlignRightHeader>
            <Table.CellHeader></Table.CellHeader>
          </Table.Row>
        }
      ></StyledTable>
      <StyledTable
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
        {tableData.map((point, index) => (
          <Table.Row key={`${data.areaCode}-${point.period}--${index}`}>
            <StyledTableCell numeric>{point.period}</StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell numeric>{point.count}</StyledTableCell>
            <StyledTableCell numeric>{point.value}</StyledTableCell>
            <StyledTableCell numeric>{point.lower}</StyledTableCell>
            <StyledTableCell numeric>{point.upper}</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </Table.Row>
        ))}
      </StyledTable>
    </div>
  );
}
