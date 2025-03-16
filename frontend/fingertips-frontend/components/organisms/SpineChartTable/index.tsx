'use client';

import { Table } from 'govuk-react';
import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledGreyHeader,
} from '@/lib/tableHelpers';

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicator',
  IndicatorUnit = 'Unit',
  IndicatorPeriod = 'Period',
  AreaCount = 'Count',
  AreaValue = 'AreaValue',
  GroupValue = 'GroupValue',
  BenchmarkValue = 'Value',
  BenchmarkWorst = 'Worst',
  BenchmarkBest = 'Best',
}

export interface TableHeaderProps {
  areaName: string;
  groupName: string;
}

export interface SpineChartTableRowData {
  indicatorId: number;
  indicator: string;
  unit: string;
  period: number;
  count?: number;
  value?: number;
  groupValue?: number;
  benchmarkValue?: number;
  benchmarkWorst?: number;
  benchmarkBest?: number;
}

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableProps {
  indicators: Indicator[];
  measurementUnits: string[];
  indicatorHealthData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea[];
  best: number[];
  worst: number[];
}

const StyledAlignCentreHeader = styled(StyledAlignLeftHeader)({
  textAlign: 'center',
});

const StyledAlignCentreTableCell = styled(StyledAlignLeftTableCell)({
  textAlign: 'center',
});

const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'left',
});

const StyledGroupSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
});

const StyledBenchmarkHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'center',
});

const StyledBenchmarkSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
});

const StyledGroupCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
});

const StyledBenchmarkCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
});

export const mapToSpineChartTableData = (
  indicators: Indicator[],
  measurementUnits: string[],
  indicatorHealthData: HealthDataForArea[],
  groupIndicatorData: HealthDataForArea[],
  englandBenchmarkData: HealthDataForArea[],
  best: number[],
  worst: number[]
): SpineChartTableRowData[] =>
  indicators.map((item, index) => ({
    indicatorId: item.indicatorId,
    indicator: item.title,
    unit: measurementUnits[index],
    period: indicatorHealthData[index].healthData[0].year,
    count: indicatorHealthData[index].healthData[0].count,
    value: indicatorHealthData[index].healthData[0].value,
    groupValue: groupIndicatorData[index].healthData[0].value,
    benchmarkValue: englandBenchmarkData[index].healthData[0].value,
    benchmarkBest: best[index],
    benchmarkWorst: worst[index],
  }));

const sortByIndicator = (
  tableRowData: SpineChartTableRowData[]
): SpineChartTableRowData[] =>
  tableRowData.toSorted((a, b) => a.indicatorId - b.indicatorId);

export function SpineChartTableHeader({
  areaName,
  groupName,
}: Readonly<TableHeaderProps>) {
  return (
    <>
      <Table.Row key={areaName}>
        <Table.CellHeader
          colSpan={3}
          data-testid="empty-header"
        ></Table.CellHeader>
        <StyledAlignLeftHeader colSpan={2} data-testid="area-header">
          {areaName}
        </StyledAlignLeftHeader>
        <StyledGroupHeader data-testid="group-header">
          {groupName}
        </StyledGroupHeader>
        <StyledBenchmarkHeader colSpan={3} data-testid="england-header">
          Benchmark: England
        </StyledBenchmarkHeader>
      </Table.Row>
      <Table.Row>
        {Object.values(SpineChartTableHeadingEnum).map((heading, index) =>
          index === 0 || index === 1 ? (
            <StyledAlignLeftHeader
              key={index}
              data-testid={`${heading}-header-${index}`}
            >
              {heading}
            </StyledAlignLeftHeader>
          ) : index === 2 || index === 3 ? (
            <StyledAlignCentreHeader
              key={index}
              data-testid={`${heading}-header-${index}`}
            >
              {heading}
            </StyledAlignCentreHeader>
          ) : index === 4 ? (
            <StyledAlignRightHeader
              key={index}
              data-testid={`${heading}-header-${index}`}
            >
              Value
            </StyledAlignRightHeader>
          ) : index === 5 ? (
            <StyledGroupSubHeader
              key={index}
              data-testid={`${heading}-header-${index}`}
            >
              Value
            </StyledGroupSubHeader>
          ) : (
            <StyledBenchmarkSubHeader
              key={index}
              data-testid={`${heading}-header-${index}`}
            >
              {heading}
            </StyledBenchmarkSubHeader>
          )
        )}
      </Table.Row>
    </>
  );
}

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return <>{value || 'X'}</>;
}

export function SpineChartTableRow({
  indicator,
  unit,
  period,
  count,
  value,
  groupValue,
  benchmarkValue,
  benchmarkWorst,
  benchmarkBest,
}: Readonly<SpineChartTableRowData>) {
  return (
    <Table.Row>
      <StyledAlignLeftTableCell data-testid={`indicator-cell`}>
        {indicator}
      </StyledAlignLeftTableCell>
      <StyledAlignLeftTableCell data-testid={`unit-cell`}>
        {unit}
      </StyledAlignLeftTableCell>
      <StyledAlignCentreTableCell data-testid={`period-cell`}>
        {period}
      </StyledAlignCentreTableCell>
      <StyledAlignCentreTableCell data-testid={`count-cell`}>
        <SpineChartMissingValue value={count} />
      </StyledAlignCentreTableCell>
      <StyledAlignRightTableCell data-testid={`value-cell`}>
        <SpineChartMissingValue value={value} />
      </StyledAlignRightTableCell>
      <StyledGroupCell data-testid={`group-value-cell`}>
        <SpineChartMissingValue value={groupValue} />
      </StyledGroupCell>
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        <SpineChartMissingValue value={benchmarkValue} />
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {benchmarkWorst}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {benchmarkBest}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}

export function SpineChartTable({
  indicators,
  measurementUnits,
  indicatorHealthData,
  groupIndicatorData,
  englandBenchmarkData,
  worst,
  best,
}: Readonly<SpineChartTableProps>) {
  const tableData = mapToSpineChartTableData(
    indicators,
    measurementUnits,
    indicatorHealthData,
    groupIndicatorData,
    englandBenchmarkData,
    worst,
    best
  );
  const sortedData = sortByIndicator(tableData);

  return (
    <StyledDiv data-testid="spineChartTable-component">
      <Table>
        <SpineChartTableHeader
          areaName={indicatorHealthData[0].areaName}
          groupName={groupIndicatorData[0].areaName}
        />
        {sortedData.map((row, index) => {
          return (
            <React.Fragment key={index}>
              <SpineChartTableRow
                indicatorId={index}
                indicator={row.indicator}
                unit={row.unit}
                period={row.period}
                count={row.count}
                value={row.value}
                groupValue={row.groupValue}
                benchmarkValue={row.benchmarkValue}
                benchmarkWorst={row.benchmarkWorst}
                benchmarkBest={row.benchmarkBest}
              />
            </React.Fragment>
          );
        })}
      </Table>
    </StyledDiv>
  );
}
