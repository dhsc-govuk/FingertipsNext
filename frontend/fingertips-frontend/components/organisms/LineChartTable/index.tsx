'use client';

import { Table } from 'govuk-react';
import {
  BenchmarkComparisonMethod,
  Frequency,
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointBenchmarkComparison,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { FC } from 'react';

import {
  StyledAlignCenterTableCellWidth,
  StyledAlignLeftHeader,
  StyledAlignLeftStickyTableCell,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledAlignStickyLeftHeader,
  StyledDivWithScrolling,
} from '@/lib/tableHelpers';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import { TrendTag } from '@/components/molecules/TrendTag';
import {
  getConfidenceLimitNumber,
  getFirstPeriodForAreas,
  getLatestPeriodForAreas,
} from '@/lib/chartHelpers/chartHelpers';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { convertLineChartTableToCsvData } from '@/components/organisms/LineChartTable/convertLineChartTableToCsvData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import {
  BenchmarkWrapper,
  CellTypeEnum,
  StyledAreaNameHeader,
} from './BenchmarkingCellWrapper';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import {
  convertDateToNumber,
  formatDatePointLabel,
} from '@/lib/timePeriodHelpers/getTimePeriodLabels';

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
  title: string;
  healthIndicatorData: HealthDataForArea[];
  englandIndicatorData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  benchmarkToUse?: string;
  frequency: Frequency;
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
  marginBottom: '1rem',
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

const StyledBenchmarkCellMultipleAreas = styled(StyledAlignLeftTableCell)({
  borderLeft: 'solid black 1px',
  textAlign: 'center',
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
  dateAsNumber: number;
  period: string;
  areas: (HealthDataPoint | null)[];
  benchmarkValue?: number;
  groupValue?: number;
}

export function LineChartTable({
  title,
  healthIndicatorData,
  englandIndicatorData,
  groupIndicatorData,
  indicatorMetadata,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  benchmarkToUse,
  frequency,
}: Readonly<LineChartTableProps>) {
  const englandColumnPrefix =
    benchmarkToUse !== areaCodeForEngland ? '' : 'Benchmark: ';
  const groupColumnPrefix =
    benchmarkToUse !== areaCodeForEngland ? 'Benchmark: ' : 'Group: ';

  if (englandIndicatorData && healthIndicatorData.length === 0) {
    healthIndicatorData = [englandIndicatorData];
  }

  healthIndicatorData = healthIndicatorData.toSorted((a, b) =>
    a.areaName.localeCompare(b.areaName)
  );

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const showEnglandColumn =
    healthIndicatorData[0]?.areaCode !== areaCodeForEngland;

  const showGroupColumn =
    healthIndicatorData[0]?.areaCode !== areaCodeForEngland &&
    groupIndicatorData &&
    groupIndicatorData?.healthData?.length > 0;

  const allHealthPointDatesAsNumbers = [
    ...(englandIndicatorData?.healthData ?? []),
    ...(groupIndicatorData?.healthData ?? []),
    ...healthIndicatorData.flatMap((area) => area.healthData),
  ].map(({ datePeriod }) => convertDateToNumber(datePeriod?.to));

  const firstDateAsNumber = getFirstPeriodForAreas(healthIndicatorData);
  const lastDateAsNumber = getLatestPeriodForAreas(healthIndicatorData);
  if (!firstDateAsNumber || !lastDateAsNumber) {
    return null;
  }

  const allDatesAsNumbers = [...new Set(allHealthPointDatesAsNumbers)]
    .filter(
      (dateAsNumber) =>
        dateAsNumber >= firstDateAsNumber && dateAsNumber <= lastDateAsNumber
    )
    .sort((a, b) => a - b);

  const rowData = allDatesAsNumbers
    .map((dateAsNumber) => {
      const englandHealthPoint = englandIndicatorData?.healthData.find(
        (healthPoint) =>
          convertDateToNumber(healthPoint.datePeriod?.to) === dateAsNumber
      );

      const datePeriod = englandHealthPoint?.datePeriod;

      const formattedPeriod = formatDatePointLabel(datePeriod, frequency, 1);

      const row: AreaDataMatchedByYear = {
        dateAsNumber,
        period: formattedPeriod,
        areas: [],
        benchmarkValue: englandHealthPoint?.value,
      };

      // find a health point for each area for the given year
      healthIndicatorData.forEach((areaData) => {
        const matchByYear = areaData.healthData.find(
          (healthPoint) =>
            convertDateToNumber(healthPoint.datePeriod?.to) === dateAsNumber
        );
        row.areas.push(matchByYear ?? null);
      });

      // find the group value for the given year
      const groupMatchedByYear = groupIndicatorData?.healthData.find(
        (healthPoint) =>
          convertDateToNumber(healthPoint.datePeriod?.to) === dateAsNumber
      );
      row.groupValue = groupMatchedByYear?.value;

      return row;
    })
    .toSorted((a, b) => a.dateAsNumber - b.dateAsNumber);

  const csvData = indicatorMetadata
    ? convertLineChartTableToCsvData(
        indicatorMetadata,
        healthIndicatorData,
        showGroupColumn ? groupIndicatorData : undefined,
        showEnglandColumn ? englandIndicatorData : undefined,
        confidenceLimit
      )
    : undefined;
  const id = 'lineChartTable';

  return (
    <>
      <StyledDivWithScrolling id={id} data-testid={`${id}-component`}>
        <ChartTitle>{title}</ChartTitle>
        <StyledTable
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
                  <BenchmarkWrapper
                    label="group"
                    benchmarkToUse={benchmarkToUse}
                    cellType={CellTypeEnum.Header}
                  >
                    {groupColumnPrefix} {groupIndicatorData?.areaName}
                  </BenchmarkWrapper>
                ) : null}
                {showEnglandColumn ? (
                  <BenchmarkWrapper
                    label="england"
                    benchmarkToUse={benchmarkToUse}
                    cellType={CellTypeEnum.Header}
                  >
                    {englandColumnPrefix} <br /> England
                  </BenchmarkWrapper>
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
                    <BenchmarkWrapper
                      label="group"
                      benchmarkToUse={benchmarkToUse}
                      cellType={CellTypeEnum.Cell}
                    />
                  ) : null}
                  {showEnglandColumn ? (
                    <BenchmarkWrapper
                      label="england"
                      benchmarkToUse={benchmarkToUse}
                      cellType={CellTypeEnum.Cell}
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
                  <BenchmarkWrapper
                    benchmarkToUse={benchmarkToUse}
                    label="group"
                    cellType={CellTypeEnum.SubHeader}
                  >
                    Value
                    <StyledSpan>{indicatorMetadata?.unitLabel}</StyledSpan>
                  </BenchmarkWrapper>
                ) : null}
                {showEnglandColumn ? (
                  <BenchmarkWrapper
                    benchmarkToUse={benchmarkToUse}
                    label="england"
                    cellType={CellTypeEnum.SubHeader}
                  >
                    {LineChartTableHeadingEnum.BenchmarkValue}{' '}
                    <StyledSpan>{indicatorMetadata?.unitLabel}</StyledSpan>
                  </BenchmarkWrapper>
                ) : null}
              </Table.Row>
            </>
          }
        >
          {rowData.map(
            ({
              dateAsNumber: year,
              areas,
              benchmarkValue,
              groupValue,
              period,
            }) => (
              <Table.Row
                key={`lineChartTableRow-${year}`}
                data-testid={`lineChartTableRow-${year}`}
              >
                <StyledAlignLeftStickyTableCell numeric>
                  {period}
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
                  <BenchmarkWrapper
                    label="group"
                    benchmarkToUse={benchmarkToUse}
                    cellType={CellTypeEnum.Cell}
                  >
                    {formatNumber(groupValue)}
                  </BenchmarkWrapper>
                ) : null}
                {showEnglandColumn ? (
                  <BenchmarkWrapper
                    label="england"
                    benchmarkToUse={benchmarkToUse}
                    cellType={CellTypeEnum.Cell}
                  >
                    {formatNumber(benchmarkValue)}
                  </BenchmarkWrapper>
                ) : null}
              </Table.Row>
            )
          )}
        </StyledTable>
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </StyledDivWithScrolling>
      <ExportOptionsButton targetId={id} csvData={csvData} />
    </>
  );
}
