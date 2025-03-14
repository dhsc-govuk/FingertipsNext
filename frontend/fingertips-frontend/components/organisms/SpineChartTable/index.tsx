'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledGreyHeader,
} from '@/lib/tableHelpers';
import { Sex } from '../Inequalities/inequalitiesHelpers';

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicator',
  IndicatorUnit = 'Unit',
  IndicatorPeriod = 'Period',
  AreaCount = 'Count',
  AreaValue = 'Value',
  GroupValue = 'Value',
  BenchmarkValue = 'Value',
  BenchmarkWorst = 'Worst',
  BenchmarkBest = 'Best',
}

export interface TableProps {
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea;
  groupIndicatorData: HealthDataForArea;
}

export interface TableHeaderProps {
  areaName: string;
  groupName: string;
}

export interface SpineChartTableRowData {
  indicator: string;
  unit: string;
  period: string;
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

export function SpineChartTableHeader({
  areaName,
  groupName,
}: Readonly<TableHeaderProps>) {
  return (
    <>
      <Table.Row>
        <Table.CellHeader colspan={3}  data-testid="empty-header">
        </Table.CellHeader>
        <StyledAlignLeftHeader colspan={2} data-testid="area-header">
          {areaName}
        </StyledAlignLeftHeader>
        <StyledGroupHeader data-testid="group-header">
          {groupName}
        </StyledGroupHeader>
        <StyledBenchmarkHeader colspan={3} data-testid="england-header">
          Benchmark: England
        </StyledBenchmarkHeader>
      </Table.Row> 
      <Table.Row>
        {Object.values(SpineChartTableHeadingEnum).map((heading, index) => (
          (index === 0) || (index === 1)?
          <StyledAlignLeftHeader data-testid={`${heading}-header-${index}`}>
          {heading}
          </StyledAlignLeftHeader>:
          (index === 2) || (index === 3)?
          <Table.CellHeader data-testid={`${heading}-header-${index}`}>
          {heading}
          </Table.CellHeader>:
          (index === 4)?
          <StyledAlignRightHeader data-testid={`${heading}-header-${index}`}>
          {heading}
          </StyledAlignRightHeader>:
          (index === 5)?
          <StyledGroupSubHeader data-testid={`${heading}-header-${index}`}>
          {heading}
          </StyledGroupSubHeader>:  
          <StyledBenchmarkSubHeader data-testid={`${heading}-header-${index}`}>
          {heading}
          </StyledBenchmarkSubHeader>   
        ))}
      </Table.Row>          
    </>
  )
}

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return (
    <>
      {value  || 'X'}         
    </>
  )
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
    <>
      <Table.Row>
          <StyledAlignLeftTableCell data-testid={`indicator-cell`}>
          {indicator}
          </StyledAlignLeftTableCell>
          <StyledAlignLeftTableCell data-testid={`unit-cell`}>
          {unit}
          </StyledAlignLeftTableCell>
          <StyledDiv data-testid={`period-cell`}>
          {period}
          </StyledDiv>
          <StyledDiv data-testid={`count-cell`}>
            <SpineChartMissingValue value={count} />
          </StyledDiv>  
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
    </>
  )
}
