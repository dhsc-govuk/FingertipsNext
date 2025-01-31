'use client';

import { Paragraph, Table } from 'govuk-react';
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
  englandBenchmarkData: HealthDataForArea | undefined;
}

interface LineChartTableRowData {
  period: number;
  count: number;
  value: number;
  lower: number;
  upper: number;
}

const StyledDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledTable = styled(Table)({
  width: '70%',
});

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
  paddingRight: '0',
});

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
});

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  width: '10%',
  padding: '1em 0',
});

const StyledBenchmarkTrendHeader = styled(StyledAlignLeftHeader)({
  width: '15%',
});

const StyledConfidenceLimitsHeader = styled(StyledAlignLeftHeader)({
  width: '18%',
  padding: '0.5em',
});

const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid #F3F2F1 2px`,
  width: '16%',
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

const StyledBenchmarkValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid #F3F2F1 2px`,
});

const StyledSpan = styled('span')({
  display: 'block',
});

const StyledParagraph = styled(Paragraph)(typography.font({ size: 14 }), {
  width: '70%',
  fontWeight: 'bold',
});

const mapToTableData = (areaData: HealthDataForArea): LineChartTableRowData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

const sortPeriodDesc = (
  tableRowData: LineChartTableRowData[]
): LineChartTableRowData[] =>
  tableRowData.toSorted((a, b) => b.period - a.period);

const convertToPercentage = (value: number): string => {
  // dummy function to do percentage conversions until real conversion logic is provided
  return `${((value / 10000) * 100).toFixed(1)}%`;
};

const getCellHeader = (heading: string, index: number): ReactNode => {
  if (heading === LineChartTableHeadingEnum.BenchmarkValue)
    return (
      <StyledGreyHeader
        data-testid={`header-${heading}-${index}`}
        key={`header-${heading}`}
      >
        {heading} <StyledSpan>(%)</StyledSpan>
      </StyledGreyHeader>
    );

  if (heading === LineChartTableHeadingEnum.BenchmarkTrend)
    return (
      <StyledBenchmarkTrendHeader
        data-testid={`header-${heading}-${index}`}
        key={`header-${heading}`}
      >
        {heading}
      </StyledBenchmarkTrendHeader>
    );

  if (heading === LineChartTableHeadingEnum.AreaPeriod)
    return (
      <StyledAlignLeftHeader
        data-testid={`header-${heading}-${index}`}
        key={`header-${heading}`}
      >
        {heading}
      </StyledAlignLeftHeader>
    );

  return heading === LineChartTableHeadingEnum.AreaCount ? (
    <StyledAlignRightHeader
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading}
    </StyledAlignRightHeader>
  ) : (
    <StyledAlignRightHeader
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading} <StyledSpan>(%)</StyledSpan>
    </StyledAlignRightHeader>
  );
};

export function LineChartTable({
  data,
  englandBenchmarkData,
}: Readonly<TableProps>) {
  const tableData = mapToTableData(data);
  const englandData = englandBenchmarkData
    ? mapToTableData(englandBenchmarkData)
    : [];
  const dataSortedByPeriodDesc = sortPeriodDesc(tableData);
  const englandRowDataDesc = sortPeriodDesc(englandData);
  return (
    <>
      <StyledDiv>
        <StyledParagraph>{data.areaName + ` recent trend:`}</StyledParagraph>
      </StyledDiv>
      <StyledDiv data-testid="lineChartTable-component">
        <StyledTable
          head={
            <>
              <Table.Row>
                <Table.CellHeader colSpan={3}></Table.CellHeader>
                <StyledAreaNameHeader>{data.areaName}</StyledAreaNameHeader>
                <Table.CellHeader colSpan={2}></Table.CellHeader>
                <StyledGreyHeader data-testid="england-header">
                  Benchmark: <br /> England
                </StyledGreyHeader>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader colSpan={5}></Table.CellHeader>
                <StyledConfidenceLimitsHeader>
                  95% confidence limits
                </StyledConfidenceLimitsHeader>
                <StyledGreyHeader></StyledGreyHeader>
              </Table.Row>
              <Table.Row>
                {Object.values(LineChartTableHeadingEnum).map(
                  (heading, index) => getCellHeader(heading, index)
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
                {convertToPercentage(point.value)}
              </StyledAlignRightTableCell>
              <StyledAlignRightTableCell numeric>
                {convertToPercentage(point.lower)}
              </StyledAlignRightTableCell>
              <StyledAlignRightTableCell numeric>
                {convertToPercentage(point.upper)}
              </StyledAlignRightTableCell>
              <StyledBenchmarkValueTableCell data-testid="grey-table-cell">
                {englandRowDataDesc.length
                  ? convertToPercentage(englandRowDataDesc[index].value)
                  : '-'}
              </StyledBenchmarkValueTableCell>
            </Table.Row>
          ))}
        </StyledTable>
      </StyledDiv>
    </>
  );
}
