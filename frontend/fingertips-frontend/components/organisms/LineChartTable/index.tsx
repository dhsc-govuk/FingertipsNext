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
import { convertLineChartTableToCsvData } from '@/components/organisms/LineChartTable/convertLineChartTableToCsvData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';

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
  indicatorMetadata?: IndicatorDocument;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  benchmarkOptions?: string;
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
  textAlign: 'right',
  verticalAlign: 'top',
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

const StyledAlternateEnglandHeaderBackgroundColour = styled(StyledStickyRightHeader)({
  backgroundColor: GovukColours.LightGrey,
  verticalAlign: 'top',
});

const StyledAlternateGroupHeaderBackgroundColour = styled(StyledGroupNameHeader)({
  backgroundColor: GovukColours.MidGrey,
});

const StyledAlternateGroupSubHeader = styled(StyledLightGreySubHeader)({
  borderTop: `solid #F3F2F1 2px`,
  backgroundColor: GovukColours.MidGrey,
})

const StyledAlternateEnglandSubHeader = styled(StyledLightGreySubHeader)({
  backgroundColor: GovukColours.LightGrey,
})

const StyledAlternateGroupBenchmarkCell = styled(StyledGroupValueTableCell)(
  {
    borderTop: `solid #F3F2F1 2px`,
    backgroundColor: GovukColours.MidGrey,
  }
);

const StyledAlternateEnglandBenchmarkCell = styled(StyledStickyRight)({
  backgroundColor: GovukColours.LightGrey,
})

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
  indicatorMetadata,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  benchmarkOptions,
}: Readonly<LineChartTableProps>) {
  // const AlternateBenchmarkCellContainer = styled(Table.Cell)<{
  //   isMidGrey: boolean;
  // }>(({ isMidGrey }) => ({
  //   backgroundColor: isMidGrey ? GovukColours.MidGrey : GovukColours.LightGrey,
  // }));
  //
  // const AlternateBenchmarkColumnWrapper: React.FC<{
  //   children?: React.ReactNode;
  //   benchmarkOptions: string | undefined;
  // }> = ({ children, benchmarkOptions = areaCodeForEngland }) => {
  //
  //   const isMidGrey = benchmarkOptions !== areaCodeForEngland;
  //
  //   return (
  //     <AlternateBenchmarkCellContainer isMidGrey={isMidGrey}>
  //       {children}
  //     </AlternateBenchmarkCellContainer>
  //   );
  // };

  type AlternateBenchmarkCellProps = {
    children?: React.ReactNode;
    benchmarkOptions: string | undefined;
    label: 'group' | 'benchmark';
  };

  const AlternateBenchmarkHeaderCell: React.FC<AlternateBenchmarkCellProps> = ({
    children,
    benchmarkOptions = areaCodeForEngland,
    label,
  }) => {
    let CellWrapper: React.ComponentType<any>;
    if (label === 'group') {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateGroupHeaderBackgroundColour
          : StyledGroupNameHeader;
    } else {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateEnglandHeaderBackgroundColour
          : StyledStickyRightHeader;
    }
    return <CellWrapper>{children}</CellWrapper>;
  };

  const AlternateBenchmarkSubHeaderCellWrapper: React.FC<
    AlternateBenchmarkCellProps
  > = ({ children, benchmarkOptions = areaCodeForEngland, label }) => {
    let CellWrapper: React.ComponentType<any>;
    if (label === 'group') {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateGroupSubHeader
          : StyledLightGreySubHeader;
    } else {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateEnglandHeaderBackgroundColour
          : StyledStickyRightHeader;
    }
    return <CellWrapper>{children}</CellWrapper>;
  };

  const AlternateBenchmarkCell: React.FC<AlternateBenchmarkCellProps> = ({
    children,
    benchmarkOptions = areaCodeForEngland,
    label,
  }) => {
    let CellWrapper: React.ComponentType<any>;
    if (label === 'group') {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateGroupBenchmarkCell
          : StyledGroupValueTableCell;
    } else {
      CellWrapper =
        benchmarkOptions !== areaCodeForEngland
          ? StyledAlternateEnglandBenchmarkCell
          : StyledStickyRight;
    }
    return <CellWrapper>{children}</CellWrapper>;
  };

  const englandColumnPrefix =
    benchmarkOptions !== areaCodeForEngland ? '' : 'Benchmark: ';
  const groupColumnPrefix =
    benchmarkOptions !== areaCodeForEngland ? 'Benchmark: ' : 'Group: ';

    // const BenchmarkHeaderCellWrapper = benchmarkOptions !== areaCodeForEngland
    //   ? StyledAlternateEnglandColumn
    //   : StyledStickyRightHeader;
    //
    // const GroupHeaderCellWrapper = benchmarkOptions !== areaCodeForEngland
    //   ? StyledAlternateGroupColumn
    //   : StyledGroupNameHeader;

  const getAlternateBenchmarkCellBackgroundColour = (label: 'group' | 'benchmark' ) => {
    if(label === 'group') {
      return benchmarkOptions !== areaCodeForEngland
        ? GovukColours.MidGrey
        : GovukColours.LightGrey;
    }
    if(label === 'benchmark') {
      return benchmarkOptions !== areaCodeForEngland
        ? GovukColours.LightGrey
        : GovukColours.MidGrey;
    }
  }

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

  const csvData = indicatorMetadata
    ? convertLineChartTableToCsvData(
        indicatorMetadata,
        healthIndicatorData,
        showGroupColumn ? groupIndicatorData : undefined,
        showBenchmarkColumn ? englandBenchmarkData : undefined,
        confidenceLimit
      )
    : undefined;

  return (
    <>
      <StyledDivWithScrolling data-testid="lineChartTable-component">
        <StyledTable
          id={'lineChartTable'}
          head={
            <>
              <Table.Row>
                <StyledTitleCell />
                {healthIndicatorData.map((area, index) => (
                  <StyledAlignTrendHeader
                    colSpan={5}
                    key={area.areaName + index}
                  >
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
              </Table.Row>
              <Table.Row>
                <Table.CellHeader />
                {healthIndicatorData.map((area) => (
                  <StyledAreaNameHeader colSpan={5} key={area.areaName}>
                    {area.areaName}
                  </StyledAreaNameHeader>
                ))}
                {showGroupColumn ? (
                  <AlternateBenchmarkHeaderCell
                    data-testid="group-header"
                    label="group"
                    benchmarkOptions={benchmarkOptions}
                  >
                    {groupColumnPrefix} {groupIndicatorData?.areaName}
                  </AlternateBenchmarkHeaderCell>
                ) : null}
                {showBenchmarkColumn ? (
                  <AlternateBenchmarkHeaderCell
                    data-testid="england-header"
                    label="benchmark"
                    benchmarkOptions={benchmarkOptions}
                  >
                    {englandColumnPrefix} <br /> England
                  </AlternateBenchmarkHeaderCell>
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
                  {showGroupColumn ? (
                    <AlternateBenchmarkCell
                      label="group"
                      benchmarkOptions={benchmarkOptions}
                    />
                  ) : null}
                  {showBenchmarkColumn ? (
                    <AlternateBenchmarkCell
                      label="benchmark"
                      benchmarkOptions={benchmarkOptions}
                    />
                  ) : null}
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
                        units={indicatorMetadata?.unitLabel}
                      />
                    ))
                )}
                {showGroupColumn ? (
                  <AlternateBenchmarkSubHeaderCellWrapper benchmarkOptions={benchmarkOptions} label="group">
                    Value
                    <StyledSpan>{indicatorMetadata?.unitLabel}</StyledSpan>
                  </AlternateBenchmarkSubHeaderCellWrapper>
                ) : null}
                {showBenchmarkColumn ? (
                  <AlternateBenchmarkSubHeaderCellWrapper
                    data-testid={`header-benchmark-value`}
                    benchmarkOptions={benchmarkOptions} label="benchmark"
                  >
                    {LineChartTableHeadingEnum.BenchmarkValue}{' '}
                    <StyledSpan>{indicatorMetadata?.unitLabel}</StyledSpan>
                  </AlternateBenchmarkSubHeaderCellWrapper>
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
                <AlternateBenchmarkCell label='group' benchmarkOptions={benchmarkOptions} >
                  {formatNumber(groupValue)}
                </AlternateBenchmarkCell>
              ) : null}
              {showBenchmarkColumn ? (
                <AlternateBenchmarkCell data-testid="grey-table-cell" label='benchmark' benchmarkOptions={benchmarkOptions}>
                  {formatNumber(benchmarkValue)}
                </AlternateBenchmarkCell>
              ) : null}
            </Table.Row>
          ))}
        </StyledTable>
      </StyledDivWithScrolling>
      <ExportOptionsButton targetId={'lineChartTable'} csvData={csvData} />
    </>
  );
}
