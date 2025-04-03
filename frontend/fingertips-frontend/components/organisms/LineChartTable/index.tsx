'use client';

import { Table } from 'govuk-react';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  HealthDataPointBenchmarkComparison,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { FC } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledGreyHeader,
  StyledGreyTableCellValue,
} from '@/lib/tableHelpers';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import { TrendTag } from '@/components/molecules/TrendTag';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  BenchmarkTrend = 'Compared to benchmark',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}

export interface LineChartTableProps {
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export interface LineChartTableRowData {
  period: number;
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
}

const StyledTable = styled(Table)({
  borderCollapse: 'separate',
});

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  borderTop: `solid #F3F2F1 2px`, // aligns top to match grey heading cells
  textAlign: 'center',
});

const StyledGroupNameHeader = styled(StyledAreaNameHeader)({
  background: GovukColours.LightGrey,
  paddingRight: '0.5em',
  paddingLeft: '0.5em',
});

const StyledBenchmarkTrendHeader = styled(StyledAlignLeftHeader)({
  paddingLeft: '0.5em',
});

const StyledBenchmarkTrendHeaderMultipleAreas = styled(
  StyledBenchmarkTrendHeader
)({
  borderLeft: 'solid black 1px',
});

const StyledConfidenceLimitsHeader = styled(StyledAlignLeftHeader)({
  padding: '0.5em',
  textAlign: 'center',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
});

const StyledTrendContainer = styled('div')({
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
  gap: 8,
  paddingLeft: 8,
  whiteSpace: 'nowrap',
});

const StyledLightGreyHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
});

const StyledLightGreySubHeader = styled(StyledLightGreyHeader)({
  borderLeft: 'solid black 1px',
  paddingLeft: '0.5em',
});

const StyledBenchmarkCellMultipleAreas = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
});

const StyledGroupValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderLeft: `solid black 1px`,
});

const StyledSpan = styled('span')({
  display: 'block',
});

const stickyLeft = {
  position: 'sticky',
  left: 0,
  backgroundColor: GovukColours.White,
  zIndex: 10,
  borderRight: 'solid black 1px',
  paddingRight: '0.5em',
};

const stickyRight = {
  position: 'sticky',
  right: 0,
  zIndex: 10,
  borderLeft: 'solid black 1px',
  paddingLeft: '0.5em',
  paddingRight: '0.5em !important', // overrides the :last-child declaration which removes right padding
};

const StyledAlignLeftStickyTableCell = styled(StyledAlignLeftTableCell)(
  stickyLeft as unknown as TemplateStringsArray
);

const StyledAlignStickyLeftHeader = styled(StyledAlignLeftHeader)(
  stickyLeft as unknown as TemplateStringsArray
);

const StyledStickyRight = styled(StyledGreyTableCellValue)(
  stickyRight as unknown as TemplateStringsArray
);

const StyledStickyRightHeader = styled(StyledGreyHeader)(
  stickyRight as unknown as TemplateStringsArray
);

const sortPeriod = (
  tableRowData: LineChartTableRowData[]
): LineChartTableRowData[] =>
  tableRowData.toSorted((a, b) => a.period - b.period);

const getCellHeaderComponent = (
  heading: LineChartTableHeadingEnum,
  areaIndex: number
) => {
  if (heading !== LineChartTableHeadingEnum.BenchmarkTrend)
    return StyledAlignRightHeader;
  if (areaIndex === 0) return StyledBenchmarkTrendHeader;
  return StyledBenchmarkTrendHeaderMultipleAreas;
};

interface CellHeaderProps {
  heading: LineChartTableHeadingEnum;
  areaIndex: number;
  units?: string;
}

const CellHeader: FC<CellHeaderProps> = ({
  heading,
  areaIndex,
  units = '',
}) => {
  const CellHeaderComponent = getCellHeaderComponent(heading, areaIndex);

  return (
    <CellHeaderComponent data-testid={`header-${heading}-${areaIndex}`}>
      {heading}
      {heading === LineChartTableHeadingEnum.AreaValue ? (
        <StyledSpan>{` ${units}`}</StyledSpan>
      ) : null}
    </CellHeaderComponent>
  );
};

interface BenchmarkCellProps {
  border: boolean;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

const BenchmarkCell: FC<BenchmarkCellProps> = ({
  border = false,
  benchmarkComparison,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}) => {
  const CellWrapper = border
    ? StyledBenchmarkCellMultipleAreas
    : StyledAlignLeftTableCell;

  return (
    <CellWrapper>
      <BenchmarkLabel
        outcome={benchmarkComparison?.outcome}
        method={benchmarkComparisonMethod}
        polarity={polarity}
      />
    </CellWrapper>
  );
};

export const mapToLineChartTableData = (
  areaData: HealthDataForArea
): LineChartTableRowData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
    benchmarkComparison: healthPoint.benchmarkComparison,
  }));

const StyledTitleCell = styled(StyledAlignLeftHeader)({
  border: 'none',
});
const StyledDivWithScrolling = styled('div')({
  overflowX: 'scroll',
  width: '100%',
});

const getConfidenceLimitCellSpan = (index: number): number =>
  index === 0 ? 4 : 3;

export function LineChartTable({
  healthIndicatorData,
  englandBenchmarkData,
  groupIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}: Readonly<LineChartTableProps>) {
  if (englandBenchmarkData && healthIndicatorData.length === 0) {
    healthIndicatorData = [englandBenchmarkData];
  }

  const tableData = healthIndicatorData.map((areaData) =>
    mapToLineChartTableData(areaData)
  );

  const groupData = groupIndicatorData
    ? mapToLineChartTableData(groupIndicatorData)
    : [];

  const sortedDataPerArea = tableData.map((area) => sortPeriod(area));
  const sortedEnglandData = sortedDataPerArea[0].map((row) => ({
    period: row.period,
    benchmarkValue: row.benchmarkComparison?.benchmarkValue,
  }));
  const sortedGroupData = sortPeriod(groupData);

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const showBenchmarkColumn =
    healthIndicatorData[0]?.areaCode !== areaCodeForEngland &&
    benchmarkComparisonMethod !== BenchmarkComparisonMethod.Quintiles;

  return (
    <StyledDivWithScrolling data-testid="lineChartTable-component">
      <StyledTable
        head={
          <>
            <Table.Row>
              <StyledTitleCell />
              {healthIndicatorData.map((area, index) => (
                <StyledTitleCell colSpan={5} key={area.areaName + index}>
                  <StyledTrendContainer>
                    Recent trend:
                    <TrendTag
                      trendFromResponse={
                        area.healthData[area.healthData.length - 1].trend
                      }
                    />
                  </StyledTrendContainer>
                </StyledTitleCell>
              ))}
              {groupIndicatorData ? <StyledTitleCell /> : null}
              {showBenchmarkColumn ? <StyledStickyRightHeader /> : null}
            </Table.Row>
            <Table.Row>
              <Table.CellHeader />
              {healthIndicatorData.map((area) => (
                <StyledAreaNameHeader colSpan={5} key={area.areaName}>
                  {area.areaName}
                </StyledAreaNameHeader>
              ))}
              {groupIndicatorData ? (
                <StyledGroupNameHeader data-testid="group-header">
                  Group: {groupIndicatorData.areaName}
                </StyledGroupNameHeader>
              ) : null}
              {showBenchmarkColumn ? (
                <StyledStickyRightHeader data-testid="england-header">
                  Benchmark: <br /> England
                </StyledStickyRightHeader>
              ) : null}
            </Table.Row>
            {confidenceLimit ? (
              <Table.Row>
                {healthIndicatorData.map((area, index) => (
                  <React.Fragment key={area.areaName}>
                    <Table.CellHeader
                      colSpan={getConfidenceLimitCellSpan(index)}
                    />
                    <StyledConfidenceLimitsHeader colSpan={2}>
                      {confidenceLimit}%<br />
                      confidence
                      <br />
                      limits
                    </StyledConfidenceLimitsHeader>
                  </React.Fragment>
                ))}
                {groupIndicatorData ? <StyledLightGreyHeader /> : null}
                {showBenchmarkColumn ? <StyledStickyRightHeader /> : null}
              </Table.Row>
            ) : null}

            {/* The header rendering is here */}
            <Table.Row>
              <StyledAlignStickyLeftHeader
                data-testid={`header-${LineChartTableHeadingEnum.AreaPeriod}-${0}`}
                key={`header-${LineChartTableHeadingEnum.AreaPeriod}`}
              >
                {LineChartTableHeadingEnum.AreaPeriod}
              </StyledAlignStickyLeftHeader>
              {healthIndicatorData.map((_, areaIndex) =>
                Object.values(LineChartTableHeadingEnum)
                  .filter(
                    (value) =>
                      value !== LineChartTableHeadingEnum.AreaPeriod &&
                      value !== LineChartTableHeadingEnum.BenchmarkValue
                  )
                  .map((heading) => (
                    <CellHeader
                      key={`header-${heading}`}
                      heading={heading}
                      areaIndex={areaIndex}
                      units={measurementUnit}
                    />
                  ))
              )}
              {groupIndicatorData ? (
                <StyledLightGreySubHeader>
                  Value ({measurementUnit})
                </StyledLightGreySubHeader>
              ) : null}
              {showBenchmarkColumn ? (
                <StyledStickyRightHeader data-testid={`header-benchmark-value`}>
                  {LineChartTableHeadingEnum.BenchmarkValue}{' '}
                  <StyledSpan>{measurementUnit}</StyledSpan>
                </StyledStickyRightHeader>
              ) : null}
            </Table.Row>
          </>
        }
      >
        {sortedEnglandData.map((point, index) => (
          <Table.Row key={point.period + index}>
            <StyledAlignLeftStickyTableCell numeric>
              {point.period}
            </StyledAlignLeftStickyTableCell>
            {sortedDataPerArea.map((sortedAreaData, areaIndex) => (
              <React.Fragment
                key={healthIndicatorData[areaIndex].areaCode + index}
              >
                <BenchmarkCell
                  benchmarkComparison={
                    sortedAreaData[index].benchmarkComparison
                  }
                  benchmarkComparisonMethod={benchmarkComparisonMethod}
                  polarity={polarity}
                  border={areaIndex > 0}
                />
                <StyledAlignRightTableCell numeric>
                  {formatWholeNumber(sortedAreaData[index].count)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(sortedAreaData[index].value)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(sortedAreaData[index].lower)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(sortedAreaData[index].upper)}
                </StyledAlignRightTableCell>
              </React.Fragment>
            ))}
            {groupIndicatorData ? (
              <StyledGroupValueTableCell>
                {formatNumber(sortedGroupData[index].value)}
              </StyledGroupValueTableCell>
            ) : null}
            {showBenchmarkColumn ? (
              <StyledStickyRight data-testid="grey-table-cell">
                {formatNumber(point.benchmarkValue)}
              </StyledStickyRight>
            ) : null}
          </Table.Row>
        ))}
      </StyledTable>
    </StyledDivWithScrolling>
  );
}
