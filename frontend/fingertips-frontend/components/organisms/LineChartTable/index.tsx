'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { ReactNode } from 'react';
import {
  LIGHT_GREY,
  LineChartTableHeadingEnum,
} from '@/lib/chartHelpers/chartHelpers';

interface TableProps {
  data: HealthDataForArea;
}

interface LineChartTableRowData {
  period: number;
  count: number;
  value: number;
  lower: number;
  upper: number;
}

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
  paddingRight: '0',
});

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
});

const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: LIGHT_GREY,
});

const StyledTableCell = styled(Table.Cell)(typography.font({ size: 14 }), {
  paddingRight: '0',
});

const StyledAlignLeftTableCell = styled(StyledTableCell)({
  textAlign: 'left',
});

const StyledAlignRightTableCell = styled(StyledTableCell)({
  textAlign: 'right',
});

const StyledBenchmarkValueTableCell = styled(StyledTableCell)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid white 0.1875em`,
});

const mapToTableData = (areaData: HealthDataForArea): LineChartTableRowData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

function getCellHeader(heading: string, index: number): ReactNode {
  return heading === LineChartTableHeadingEnum.BenchmarkValue ? (
    <StyledGreyHeader
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading}
    </StyledGreyHeader>
  ) : (
    <StyledAlignRightHeader
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading}
    </StyledAlignRightHeader>
  );
}

export function LineChartTable({ data }: Readonly<TableProps>) {
  const tableData = mapToTableData(data);
  const dataSortedByPeriodDesc = tableData.toSorted(
    (a, b) => b.period - a.period
  );
  return (
    <div data-testid="lineChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignCenterHeader colSpan={6}>
                {data.areaCode}
              </StyledAlignCenterHeader>
              <StyledGreyHeader data-testid="england-header">
                England
              </StyledGreyHeader>
            </Table.Row>
            <Table.Row>
              <StyledAlignRightHeader colSpan={6}>
                95% confidence limits
              </StyledAlignRightHeader>
            </Table.Row>
            <Table.Row>
              {Object.values(LineChartTableHeadingEnum).map((heading, index) =>
                heading === 'Period' || heading === 'Trend' ? (
                  <StyledAlignLeftHeader
                    data-testid={`header-${heading}-${index}`}
                    key={`header-${heading}`}
                  >
                    {heading}
                  </StyledAlignLeftHeader>
                ) : (
                  getCellHeader(heading, index)
                )
              )}
            </Table.Row>
          </>
        }
      >
        {dataSortedByPeriodDesc.map((point, index) => (
          <Table.Row key={`${data.areaCode}-${point.period}--${index}`}>
            <StyledAlignLeftTableCell numeric>
              {point.period}
            </StyledAlignLeftTableCell>
            <StyledAlignLeftTableCell></StyledAlignLeftTableCell>
            <StyledAlignRightTableCell numeric>
              {point.count}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell numeric>
              {point.value.toFixed(1)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell numeric>
              {point.lower.toFixed(1)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell numeric>
              {point.upper.toFixed(1)}
            </StyledAlignRightTableCell>
            <StyledBenchmarkValueTableCell data-testid="grey-table-cell"></StyledBenchmarkValueTableCell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
