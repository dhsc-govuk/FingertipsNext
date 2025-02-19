'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import {
  convertToPercentage,
  LineChartTableHeadingEnum,
  LineChartTableRowData,
  StyledAlignLeftHeader,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledGreyHeader,
  StyledGreyTableCellValue,
  StyledTableCell,
} from '@/lib/tableHelpers';

interface TableProps {
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea | undefined;
}

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  width: '10%',
  padding: '1em 0',
  textAlign: 'center',
});

const StyledBenchmarkTrendHeader = styled(StyledAlignLeftHeader)({
  width: '27%',
});

const StyledBenchmarkTrendHeaderMultipleAreas = styled(
  StyledBenchmarkTrendHeader
)({
  borderLeft: 'solid black 1px',
  width: '18%',
  paddingLeft: '0.5em',
});

const StyledConfidenceLimitsHeader = styled(StyledAlignLeftHeader)({
  width: '22%',
  padding: '0.5em',
  textAlign: 'center',
});

const StyledAlignLeftTableCell = styled(StyledTableCell)({
  textAlign: 'left',
  width: '10%',
});

const StyledBenchmarkCellMultipleAreas = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
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
): LineChartTableRowData[] => {
  return tableRowData.toSorted((a, b) => a.period && b.period);
};

const getBenchmarkHeader = (
  areaCount: number,
  heading: LineChartTableHeadingEnum,
  index: number
): ReactNode =>
  areaCount < 2 ? (
    <StyledBenchmarkTrendHeader
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading}
    </StyledBenchmarkTrendHeader>
  ) : (
    <StyledBenchmarkTrendHeaderMultipleAreas
      data-testid={`header-${heading}-${index}`}
      key={`header-${heading}`}
    >
      {heading}
    </StyledBenchmarkTrendHeaderMultipleAreas>
  );

const getCellHeader = (
  heading: string,
  index: number,
  dataLength: number
): ReactNode => {
  if (heading === LineChartTableHeadingEnum.BenchmarkTrend)
    return getBenchmarkHeader(dataLength, heading, index);

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

const getBenchmarkCell = (areaCount: number) =>
  areaCount < 2 ? (
    <StyledAlignLeftTableCell></StyledAlignLeftTableCell>
  ) : (
    <StyledBenchmarkCellMultipleAreas></StyledBenchmarkCellMultipleAreas>
  );

const StyledTitleRow = styled(StyledAlignLeftHeader)({
  border: 'none',
});

const getConfidenceLimitCellSpan = (index: number): number =>
  index === 0 ? 4 : 3;

export function LineChartTable({
  healthIndicatorData,
  englandBenchmarkData,
}: Readonly<TableProps>) {
  const tableData = healthIndicatorData.map((areaData) =>
    mapToTableData(areaData)
  );
  const englandData = englandBenchmarkData
    ? mapToTableData(englandBenchmarkData)
    : [];
  const sortedDataPerArea = tableData.map((area) => sortPeriod(area));
  const englandRowData = sortPeriod(englandData);

  return (
    <StyledDiv data-testid="lineChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              {healthIndicatorData.map((area, index) => (
                <React.Fragment key={area.areaName + index}>
                  {index === 0 && healthIndicatorData.length > 1 && (
                    <StyledTitleRow></StyledTitleRow>
                  )}
                  <StyledTitleRow colSpan={5}>
                    {`${area.areaName} recent trend:`}
                  </StyledTitleRow>
                </React.Fragment>
              ))}
            </Table.Row>
            <Table.Row>
              {healthIndicatorData.map((area, index) => (
                <React.Fragment key={area.areaName}>
                  {index === 0 ? <Table.CellHeader /> : null}
                  <StyledAreaNameHeader colSpan={5}>
                    {area.areaName}
                  </StyledAreaNameHeader>
                </React.Fragment>
              ))}
              <StyledGreyHeader data-testid="england-header">
                Benchmark: <br /> England
              </StyledGreyHeader>
            </Table.Row>
            <Table.Row>
              {healthIndicatorData.map((area, index) => (
                <React.Fragment key={area.areaName}>
                  <Table.CellHeader
                    colSpan={getConfidenceLimitCellSpan(index)}
                  ></Table.CellHeader>
                  <StyledConfidenceLimitsHeader colSpan={2}>
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
              {healthIndicatorData.map(() =>
                Object.values(LineChartTableHeadingEnum)
                  .filter(
                    (value) => value !== LineChartTableHeadingEnum.AreaPeriod
                  )
                  .filter(
                    (value) =>
                      value !== LineChartTableHeadingEnum.BenchmarkValue
                  )
                  .map((heading, index) =>
                    getCellHeader(
                      heading,
                      index + 1,
                      healthIndicatorData.length
                    )
                  )
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
          <Table.Row key={point.period + index}>
            <StyledAlignLeftTableCell numeric>
              {point.period}
            </StyledAlignLeftTableCell>
            {sortedDataPerArea.map((sortedAreaData, areaIndex) => (
              <React.Fragment
                key={healthIndicatorData[areaIndex].areaCode + index}
              >
                {getBenchmarkCell(healthIndicatorData.length)}
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
            <StyledGreyTableCellValue data-testid="grey-table-cell">
              {englandRowData.length
                ? convertToPercentage(englandRowData[index].value)
                : '-'}
            </StyledGreyTableCellValue>
          </Table.Row>
        ))}
      </Table>
    </StyledDiv>
  );
}
