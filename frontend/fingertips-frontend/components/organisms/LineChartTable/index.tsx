'use client';

import { Table } from 'govuk-react';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { FC } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignCenterTableCellWidth,
  StyledAlignLeftHeader,
  StyledAlignLeftStickyTableCell,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledAlignStickyLeftHeader,
  StyledDivWithScrolling,
  StyledGreyHeader,
  StyledStickyRight,
  StyledStickyRightHeader,
} from '@/lib/tableHelpers';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import { TrendTag } from '@/components/molecules/TrendTag';
import {
  getConfidenceLimitNumber,
  getFirstYearForAreas,
  getLatestYearForAreas,
} from '@/lib/chartHelpers/chartHelpers';
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
  benchmarkOptions?: string
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
  padding: '0.6em',
  textAlign: 'center',
});

const StyledBenchmarkTrendHeaderMultipleAreas = styled(
  StyledBenchmarkTrendHeader
)({
  borderLeft: 'solid black 1px',
});

export const StyledConfidenceLimitsHeader = styled(StyledAlignLeftHeader)({
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
  paddingLeft: 0,
  whiteSpace: 'nowrap',
});

const StyledLightGreyHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
});

const StyledLightGreySubHeader = styled(StyledLightGreyHeader)({
  borderLeft: 'solid black 1px',
  paddingLeft: '0.5em',
  width: '16%',
});

const StyledBenchmarkCellMultipleAreas = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
  textAlign: 'center',
});

const StyledGroupValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderLeft: `solid black 1px`,
});

const StyledSpan = styled('span')({
  display: 'block',
});

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
    : StyledAlignCenterTableCellWidth;

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

const StyledAlignTrendHeader = styled(StyledAlignLeftHeader)({
  paddingLeft: '0px',
});

const getConfidenceLimitCellSpan = (index: number): number =>
  index === 0 ? 4 : 3;

interface AreaDataMatchedByYear {
  year: number;
  areas: (HealthDataPoint | null)[];
  benchmarkValue?: number;
  groupValue?: number;
}

export function LineChartTable({
  healthIndicatorData,
  englandBenchmarkData,
  groupIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  benchmarkOptions
}: Readonly<LineChartTableProps>) {
  if (englandBenchmarkData && healthIndicatorData.length === 0) {
    healthIndicatorData = [englandBenchmarkData];
  }

  healthIndicatorData = healthIndicatorData.toSorted((a, b) =>
    a.areaName.localeCompare(b.areaName)
  );

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const showBenchmarkColumn =
    healthIndicatorData[0]?.areaCode !== areaCodeForEngland &&
    benchmarkComparisonMethod !== BenchmarkComparisonMethod.Quintiles;

  const showGroupColumn =
    healthIndicatorData[0]?.areaCode !== areaCodeForEngland &&
    groupIndicatorData &&
    groupIndicatorData?.healthData?.length > 0;

  const allHealthPointYears = [
    ...(englandBenchmarkData?.healthData ?? []),
    ...(groupIndicatorData?.healthData ?? []),
    ...healthIndicatorData.flatMap((area) => area.healthData),
  ].map(({ year }) => year);

  const firstYear = getFirstYearForAreas(healthIndicatorData);
  const lastYear = getLatestYearForAreas(healthIndicatorData);
  if (!firstYear || !lastYear) {
    return null;
  }

  const allYears = [...new Set(allHealthPointYears)]
    .filter((year) => year >= firstYear && year <= lastYear)
    .sort((a, b) => a - b);

  const rowData = allYears
    .map((year) => {
      const englandHealthPoint = englandBenchmarkData?.healthData.find(
        (healthPoint) => healthPoint.year === year
      );

      const row: AreaDataMatchedByYear = {
        year,
        areas: [],
        benchmarkValue: englandHealthPoint?.value,
      };

      // find a health point for each area for the given year
      healthIndicatorData.forEach((areaData) => {
        const matchByYear = areaData.healthData.find(
          (healthPoint) => healthPoint.year === year
        );
        row.areas.push(matchByYear ?? null);
      });

      // find the group value for the given year
      const groupMatchedByYear = groupIndicatorData?.healthData.find(
        (healthPoint) => healthPoint.year === year
      );
      row.groupValue = groupMatchedByYear?.value;

      return row;
    })
    .toSorted((a, b) => a.year - b.year);

  return (
    <StyledDivWithScrolling data-testid="lineChartTable-component">
      <StyledTable
        head={
          <>
            <Table.Row>
              <StyledTitleCell />
              {healthIndicatorData.map((area, index) => (
                <StyledAlignTrendHeader colSpan={5} key={area.areaName + index}>
                  <StyledTrendContainer>
                    Recent trend:
                    <TrendTag
                      trendFromResponse={
                        area.healthData[area.healthData.length - 1].trend
                      }
                    />
                  </StyledTrendContainer>
                </StyledAlignTrendHeader>
              ))}
              {showGroupColumn ? <StyledTitleCell /> : null}
              {showBenchmarkColumn ? <StyledStickyRightHeader /> : null}
            </Table.Row>
            <Table.Row>
              <Table.CellHeader />
              {healthIndicatorData.map((area) => (
                <StyledAreaNameHeader colSpan={5} key={area.areaName}>
                  {area.areaName}
                </StyledAreaNameHeader>
              ))}
              {showGroupColumn ? (
                <StyledGroupNameHeader data-testid="group-header">
                  Group: {groupIndicatorData?.areaName}
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
                {showGroupColumn ? <StyledLightGreyHeader /> : null}
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
              {showGroupColumn ? (
                <StyledLightGreySubHeader>
                  Value
                  <StyledSpan>{measurementUnit}</StyledSpan>
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
        {rowData.map(({ year, areas, benchmarkValue, groupValue }) => (
          <Table.Row key={`lineChartTableRow-${year}`}>
            <StyledAlignLeftStickyTableCell numeric>
              {year}
            </StyledAlignLeftStickyTableCell>
            {areas.map((area, areaIndex) => (
              <React.Fragment
                key={`lineChartTableRow-${year}-area-${areaIndex}`}
              >
                <BenchmarkCell
                  benchmarkComparison={area?.benchmarkComparison}
                  benchmarkComparisonMethod={benchmarkComparisonMethod}
                  polarity={polarity}
                  border={areaIndex > 0}
                />
                <StyledAlignRightTableCell numeric>
                  {formatWholeNumber(area?.count)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(area?.value)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(area?.lowerCi)}
                </StyledAlignRightTableCell>
                <StyledAlignRightTableCell numeric>
                  {formatNumber(area?.upperCi)}
                </StyledAlignRightTableCell>
              </React.Fragment>
            ))}
            {showGroupColumn ? (
              <StyledGroupValueTableCell>
                {formatNumber(groupValue)}
              </StyledGroupValueTableCell>
            ) : null}
            {showBenchmarkColumn ? (
              <StyledStickyRight data-testid="grey-table-cell">
                {formatNumber(benchmarkValue)}
              </StyledStickyRight>
            ) : null}
          </Table.Row>
        ))}
      </StyledTable>
    </StyledDivWithScrolling>
  );
}
