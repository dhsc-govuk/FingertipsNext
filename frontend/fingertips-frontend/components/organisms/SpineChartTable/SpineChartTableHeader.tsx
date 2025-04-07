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
  StyledAlignCentreStickyLeftHeader,
  StyledAlignRightBorderHeader,
  StyledGroupStickyRightHeader,
  StyledGroupStickyRightSubHeader,
  StyledStickyEmptyLeftHeader,
} from './SpineChartTableStyles';

export interface TableHeaderProps {
  areaNames: string[];
  twoAreasRequested: boolean;
  groupName: string;
}

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicator',
  IndicatorUnit = 'Unit',
  IndicatorPeriod = 'Period',
  AreaTrend = 'Recent trend',
  AreaCount = 'Count',
  GroupValue = 'GroupValue',
  BenchmarkValue = 'Value',
  BenchmarkWorst = 'Worst',
  BenchmarkRange = 'Range',
  BenchmarkBest = 'Best',
}

export function SpineChartTableHeader({
  areaNames,
  twoAreasRequested,
  groupName,
}: Readonly<TableHeaderProps>) {
  return (
    <>
      <Table.Row key='area-headers'>
        {twoAreasRequested ?
          <>
            <Table.CellHeader
              colSpan={2}
              data-testid="empty-header"
            ></Table.CellHeader>
            <StyledStickyEmptyLeftHeader 
              colSpan={1} 
              data-testid="empty-header-sticky"
            >
            </StyledStickyEmptyLeftHeader>
          </>
        :
          <Table.CellHeader
            colSpan={3}
            data-testid="empty-header"
          ></Table.CellHeader>
        }
        <StyledAlignCentreHeader colSpan={twoAreasRequested ? 2 : 3} data-testid={`area-header${twoAreasRequested ? '-1' : ''}`}>
          {areaNames[0]}
        </StyledAlignCentreHeader>
        {twoAreasRequested ?
          <StyledAlignCentreHeader colSpan={2} data-testid="area-header-2">
            {areaNames[1]}
          </StyledAlignCentreHeader>
        : null}
        {twoAreasRequested ?
          <StyledGroupStickyRightHeader data-testid="group-header">
            {groupName}
          </StyledGroupStickyRightHeader>
        : 
          <StyledGroupHeader data-testid="group-header">
            {groupName}
          </StyledGroupHeader>
        }
        <StyledBenchmarkHeader colSpan={4} data-testid="england-header">
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
              return !twoAreasRequested ? (
                <StyledAlignCentreHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreHeader>
              ) : (
                <StyledAlignCentreStickyLeftHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreStickyLeftHeader>
              );
            case SpineChartTableHeadingEnum.AreaTrend:
              return !twoAreasRequested ? (
                <StyledAlignCentreHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreHeader>
              ) : null;
            case SpineChartTableHeadingEnum.AreaCount:
              return twoAreasRequested ? (
                <>
                  <StyledAlignCentreHeader
                    key={`area-1-${heading}`}
                    data-testid={`area-1-${heading}-header`}
                  >
                    {heading}
                  </StyledAlignCentreHeader>
                  <StyledAlignRightBorderHeader
                    key={'area-1-value'}
                    data-testid={'area-1-value-header'}
                  >
                    Value
                  </StyledAlignRightBorderHeader>
                  <StyledAlignCentreHeader
                    key={`area-2-${heading}`}
                    data-testid={`area-2-${heading}-header`}
                  >
                    {heading}
                  </StyledAlignCentreHeader>
                  <StyledAlignRightHeader
                    key={'area-2-value'}
                    data-testid={'area-2-value-header'}
                  >
                    Value
                  </StyledAlignRightHeader>
              </>
              ) : (
                <>
                  <StyledAlignCentreHeader
                    key={heading}
                    data-testid={`${heading}-header`}
                  >
                    {heading}
                  </StyledAlignCentreHeader>
                  <StyledAlignRightHeader
                    key={'area-value'}
                    data-testid={'area-value-header'}
                  >
                    Value
                  </StyledAlignRightHeader>
                </>
              );
            case SpineChartTableHeadingEnum.GroupValue:
              return !twoAreasRequested ? (
                <StyledGroupSubHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  Value
                </StyledGroupSubHeader>
              ) :
              (
                <StyledGroupStickyRightSubHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  Value
                </StyledGroupStickyRightSubHeader>
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
