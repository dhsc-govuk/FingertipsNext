'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { ReactNode } from 'react';
import { LineChartTableHeadingEnum } from '@/lib/chartHelpers/chartHelpers';

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

const LIGHT_GREY = '#cbcbcb';

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 16 }),
  {
    fontWeight: 'bold',
  },
  {
    paddingTop: '0.3125em',
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

const StyledConfidenceLimitsHeader = styled(StyledTableCellHeader)({
  padding: '0.625em',
});

const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: LIGHT_GREY,
});

const StyledTable = styled(Table)({
  marginBottom: '0',
});

const StyledTableCell = styled(Table.Cell)(typography.font({ size: 16 }), {
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
  borderTop: 'solid white 0.09375em',
});

const mapToTableData = (areaData: HealthDataForArea): LineChartTableData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

function getCellHeader(heading: string): ReactNode {
  return heading === LineChartTableHeadingEnum.BenchmarkValue ? (
    <StyledGreyHeader key={`header-${heading}`}>{heading}</StyledGreyHeader>
  ) : (
    <StyledAlignRightHeader key={`header-${heading}`}>
      {heading}
    </StyledAlignRightHeader>
  );
}

export function LineChartTable({ data, headings }: Readonly<TableProps>) {
  const tableData = mapToTableData(data);
  const dataSortedByPeriodDesc = tableData.toSorted(
    (a, b) => b.period - a.period
  );
  return (
    <div data-testid="lineChartTable-component">
      <StyledTable
        head={
          <Table.Row>
            <StyledAlignCenterHeader setWidth="one-quarter"></StyledAlignCenterHeader>
            <StyledAlignCenterHeader setWidth="one-quarter"></StyledAlignCenterHeader>
            <StyledAlignCenterHeader>{data.areaCode}</StyledAlignCenterHeader>
            {[...Array(7).keys()].map((i) => (
              <Table.CellHeader key={i}></Table.CellHeader>
            ))}
            <StyledGreyHeader>England</StyledGreyHeader>
          </Table.Row>
        }
      ></StyledTable>
      <StyledTable
        head={
          <Table.Row>
            <StyledAlignRightHeader setWidth="one-quarter"></StyledAlignRightHeader>
            <StyledAlignRightHeader setWidth="one-quarter"></StyledAlignRightHeader>
            {[...Array(6).keys()].map((i) => (
              <Table.CellHeader key={i}></Table.CellHeader>
            ))}
            <StyledConfidenceLimitsHeader>
              95% confidence limits
            </StyledConfidenceLimitsHeader>
          </Table.Row>
        }
      ></StyledTable>
      <StyledTable
        head={
          <Table.Row>
            {headings?.map((heading) =>
              heading === 'Period' || heading === 'Trend' ? (
                <StyledAlignLeftHeader key={`header-${heading}`}>
                  {heading}
                </StyledAlignLeftHeader>
              ) : (
                getCellHeader(heading)
              )
            )}
          </Table.Row>
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
            <StyledBenchmarkValueTableCell></StyledBenchmarkValueTableCell>
          </Table.Row>
        ))}
      </StyledTable>
    </div>
  );
}
