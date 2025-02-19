'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import React, { ReactNode } from 'react';
import { LineChartTableHeadingEnum } from '../LineChart/lineChartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface TableProps {
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea | undefined;
  parentIndicatorData?: HealthDataForArea;
}

interface LineChartTableRowData {
  period: number;
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
}

const StyledDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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
  paddingRight: '10px',
  verticalAlign: 'top',
});

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
  verticalAlign: 'top',
});

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  width: '10%',
  padding: '1em 0',
  textAlign: 'center',
});

const StyledGroupNameHeader = styled(StyledAreaNameHeader)({
  background: GovukColours.LightGrey,
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

const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: `solid #F3F2F1 2px`,
  width: '16%',
});

const StyledLightGreyHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
});

const StyledLightGreySubHeader = styled(StyledLightGreyHeader)({
  borderLeft: 'solid black 1px',
});

const StyledTableCell = styled(Table.Cell)(typography.font({ size: 14 }), {
  paddingRight: '0',
});

const StyledAlignLeftTableCell = styled(StyledTableCell)({
  textAlign: 'left',
  width: '10%',
});

const StyledBenchmarkCellMultipleAreas = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
});

const StyledAlignRightTableCell = styled(StyledTableCell)({
  textAlign: 'right',
  paddingRight: '10px',
});

const StyledBenchmarkValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: `solid #F3F2F1 2px`,
});

const StylesGroupValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderLeft: `solid black 1px`,
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

// When value is undefined, it returns an X with an aria-label for screen readers.
const convertToPercentage = (value?: number): React.ReactNode => {
  if (value === undefined) {
    return (
      <span aria-label="Not available">
        <span aria-hidden="true">X</span>
      </span>
    );
  }
  return `${((value / 10000) * 100).toFixed(1)}%`;
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
  parentIndicatorData,
}: Readonly<TableProps>) {
  const tableData = healthIndicatorData.map((areaData) =>
    mapToTableData(areaData)
  );
  const englandData = englandBenchmarkData
    ? mapToTableData(englandBenchmarkData)
    : [];
  const parentData = parentIndicatorData
    ? mapToTableData(parentIndicatorData)
    : [];
  const sortedDataPerArea = tableData.map((area) => sortPeriod(area));
  const englandRowData = sortPeriod(englandData);
  const sortedParentRowData = sortPeriod(parentData);

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
              {parentIndicatorData ? (
                <StyledGroupNameHeader data-testid="group-header">
                  Group: {parentIndicatorData.areaName}
                </StyledGroupNameHeader>
              ) : null}
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
              {parentIndicatorData ? <StyledLightGreyHeader /> : null}
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
              {parentIndicatorData ? (
                <StyledLightGreySubHeader>Value (%)</StyledLightGreySubHeader>
              ) : null}
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
            {parentIndicatorData ? (
              <StylesGroupValueTableCell>
                {convertToPercentage(sortedParentRowData[index].value)}
              </StylesGroupValueTableCell>
            ) : null}
            <StyledBenchmarkValueTableCell data-testid="grey-table-cell">
              {englandRowData.length
                ? convertToPercentage(englandRowData[index].value)
                : '-'}
            </StyledBenchmarkValueTableCell>
          </Table.Row>
        ))}
      </Table>
    </StyledDiv>
  );
}
