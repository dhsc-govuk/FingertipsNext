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
import React from 'react';

interface TableProps {
  data: HealthDataForArea[];
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

const StyledTable = styled(Table)({});

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
  paddingRight: '10px',
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
  borderLeft: 'solid black 1px',
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
  width: '10%',
});

const StyledBenchmarkCell = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
});

const StyledAlignRightTableCell = styled(StyledTableCell)({
  textAlign: 'right',
  paddingRight: '10px',
});

const StyledBenchmarkValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid #F3F2F1 2px`,
});

const StyledSpan = styled('span')({
  display: 'block',
});

const mapToTableData = (areaData: HealthDataForArea): LineChartTableRowData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

const sortPeriod = (
  tableRowData: LineChartTableRowData[]
): LineChartTableRowData[] =>
  tableRowData.toSorted((a, b) => a.period - b.period);

const convertToPercentage = (value: number): string => {
  // dummy function to do percentage conversions until real conversion logic is provided
  return `${((value / 10000) * 100).toFixed(1)}%`;
};

const getCellHeader = (heading: string, index: number): ReactNode => {
  if (heading === LineChartTableHeadingEnum.BenchmarkTrend)
    return (
      <StyledBenchmarkTrendHeader
        data-testid={`header-${heading}-${index}`}
        key={`header-${heading}`}
      >
        {heading}
      </StyledBenchmarkTrendHeader>
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

const StyledTitleRow = styled(StyledAlignLeftHeader)({
  border: 'none',
});

const getAreaNameCellSpan = (index: number): number => (index === 0 ? 3 : 2);
const getConfidenceLimitCellSpan = (index: number): number =>
  index === 0 ? 5 : 4;

export function LineChartTable({
  data,
  englandBenchmarkData,
}: Readonly<TableProps>) {
  const tableData = data.map((areaData) => mapToTableData(areaData));
  const englandData = englandBenchmarkData
    ? mapToTableData(englandBenchmarkData)
    : [];
  const sortedDataPerArea = tableData.map((area) => sortPeriod(area));
  const englandRowData = sortPeriod(englandData);
  return (
    <>
      <StyledDiv data-testid="lineChartTable-component">
        <StyledTable
          head={
            <>
              <Table.Row>
                {data.map((area, index) => (
                  <React.Fragment key={index}>
                    <StyledTitleRow colSpan={6}>
                      {`${area.areaName} recent trend:`}
                    </StyledTitleRow>
                  </React.Fragment>
                ))}
              </Table.Row>
              <Table.Row>
                {data.map((area, index) => (
                  <React.Fragment key={area.areaName}>
                    <Table.CellHeader
                      colSpan={getAreaNameCellSpan(index)}
                    ></Table.CellHeader>
                    <StyledAreaNameHeader>{area.areaName}</StyledAreaNameHeader>
                    <Table.CellHeader colSpan={2}></Table.CellHeader>
                  </React.Fragment>
                ))}
                <StyledGreyHeader data-testid="england-header">
                  Benchmark: <br /> England
                </StyledGreyHeader>
              </Table.Row>
              <Table.Row>
                {data.map((area, index) => (
                  <React.Fragment key={area.areaName}>
                    <Table.CellHeader
                      colSpan={getConfidenceLimitCellSpan(index)}
                    ></Table.CellHeader>
                    <StyledConfidenceLimitsHeader>
                      95% confidence limits
                    </StyledConfidenceLimitsHeader>
                  </React.Fragment>
                ))}
                <StyledGreyHeader></StyledGreyHeader>
              </Table.Row>
              <Table.Row>
                <StyledAlignLeftHeader
                  data-testid={`header-${LineChartTableHeadingEnum.AreaPeriod}-${0}`}
                  key={`header-${LineChartTableHeadingEnum.AreaPeriod}`}
                >
                  {LineChartTableHeadingEnum.AreaPeriod}
                </StyledAlignLeftHeader>
                {data.map(() =>
                  Object.values(LineChartTableHeadingEnum)
                    .filter(
                      (value) => value !== LineChartTableHeadingEnum.AreaPeriod
                    )
                    .filter(
                      (value) =>
                        value !== LineChartTableHeadingEnum.BenchmarkValue
                    )
                    .map((heading, index) => getCellHeader(heading, index + 1))
                )}
                <StyledGreyHeader
                  data-testid={`header-${LineChartTableHeadingEnum.BenchmarkValue}-${6}`}
                >
                  {LineChartTableHeadingEnum.BenchmarkValue}{' '}
                  <StyledSpan>(%)</StyledSpan>
                </StyledGreyHeader>
              </Table.Row>
            </>
          }
        >
          {englandRowData.map((point, index) => (
            <Table.Row key={index}>
              <StyledAlignLeftTableCell numeric>
                {point.period}
              </StyledAlignLeftTableCell>
              {sortedDataPerArea.map((sortedAreaData, areaIndex) => (
                <React.Fragment key={data[areaIndex].areaCode + index}>
                  <StyledBenchmarkCell></StyledBenchmarkCell>
                  <StyledAlignRightTableCell numeric>
                    {sortedAreaData[index].count}
                  </StyledAlignRightTableCell>
                  <StyledAlignRightTableCell numeric>
                    {convertToPercentage(sortedAreaData[index].value)}
                  </StyledAlignRightTableCell>
                  <StyledAlignRightTableCell numeric>
                    {convertToPercentage(sortedAreaData[index].lower)}
                  </StyledAlignRightTableCell>
                  <StyledAlignRightTableCell numeric>
                    {convertToPercentage(sortedAreaData[index].upper)}
                  </StyledAlignRightTableCell>
                </React.Fragment>
              ))}
              <StyledBenchmarkValueTableCell data-testid="grey-table-cell">
                {englandRowData.length
                  ? convertToPercentage(englandRowData[index].value)
                  : '-'}
              </StyledBenchmarkValueTableCell>
            </Table.Row>
          ))}
        </StyledTable>
      </StyledDiv>
    </>
  );
}
