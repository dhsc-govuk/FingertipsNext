import { Table } from 'govuk-react';
import React from 'react';
import {
  StyledAlignLeftHeader,
  StyledAlignRightHeader,
} from '@/lib/tableHelpers';

import {
  StyledAlignCentreHeader,
  StyledGroupHeader,
  StyledGroupSubHeader,
  StyledBenchmarkHeader,
  StyledBenchmarkSubHeader,
} from './SpineChartTableStyles';

export interface TableHeaderProps {
  areaName: string;
  groupName: string;
}

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicator',
  IndicatorUnit = 'Unit',
  IndicatorPeriod = 'Period',
  AreaTrend = 'Recent trend',
  AreaCount = 'Count',
  AreaValue = 'AreaValue',
  GroupValue = 'GroupValue',
  BenchmarkValue = 'Value',
  BenchmarkWorst = 'Worst',
  BenchmarkRange = 'Range',
  BenchmarkBest = 'Best',
}

export function SpineChartTableHeader({
  areaName,
  groupName,
}: Readonly<TableHeaderProps>) {
  // DHSCFT-582 - extend to allow up to 2 areas. Trends should only show for 1.
  return (
    <>
      <Table.Row key={areaName}>
        <Table.CellHeader
          colSpan={3}
          data-testid="empty-header"
        ></Table.CellHeader>
        <StyledAlignLeftHeader colSpan={3} data-testid="area-header">
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
        {Object.values(SpineChartTableHeadingEnum).map((heading) => {
          switch (heading) {
            case SpineChartTableHeadingEnum.IndicatorName:
            case SpineChartTableHeadingEnum.IndicatorUnit:
              return (
                <StyledAlignLeftHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignLeftHeader>
              );
            case SpineChartTableHeadingEnum.IndicatorPeriod:
            case SpineChartTableHeadingEnum.AreaTrend:
            case SpineChartTableHeadingEnum.AreaCount:
              return (
                <StyledAlignCentreHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreHeader>
              );
            case SpineChartTableHeadingEnum.AreaValue:
              return (
                <StyledAlignRightHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  Value
                </StyledAlignRightHeader>
              );
            case SpineChartTableHeadingEnum.GroupValue:
              return (
                <StyledGroupSubHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  Value
                </StyledGroupSubHeader>
              );
            default:
              return (
                <StyledBenchmarkSubHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledBenchmarkSubHeader>
              );
          }
        })}
      </Table.Row>
    </>
  );
}
