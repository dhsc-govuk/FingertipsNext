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
  StyledAlignRightBorderHeader,
  StyledAlignCentreBorderRightHeader,
} from './SpineChartTableStyles';
import { englandAreaString } from '@/lib/chartHelpers/constants';

export interface TableHeaderProps {
  areaNames: string[];
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
  groupName,
}: Readonly<TableHeaderProps>) {
  const twoAreasRequested = areaNames.length === 2;
  const groupIsEngland = groupName === englandAreaString;

  return (
    <>
      <Table.Row key={`${areaNames.concat()}`}>
        <Table.CellHeader
          colSpan={3}
          data-testid="empty-header"
        ></Table.CellHeader>
        {areaNames.map((areaName, index) => (
          <StyledAlignCentreHeader
            colSpan={twoAreasRequested ? 2 : 3}
            data-testid={`area-header-${index + 1}`}
            key={areaName}
          >
            {areaName}
          </StyledAlignCentreHeader>
        ))}
        {!groupIsEngland ?
          <StyledGroupHeader data-testid="group-header">
            {groupName}
          </StyledGroupHeader>
          :
          null
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
              return twoAreasRequested ? (
                <StyledAlignCentreBorderRightHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreBorderRightHeader>
              ) : (
                <StyledAlignCentreHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  {heading}
                </StyledAlignCentreHeader>
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
                <React.Fragment key={'count-value-for-areas'}>
                  <StyledAlignCentreHeader
                    key={`area-1-${heading}`}
                    data-testid={`area-1-${heading}-header`}
                  >
                    {heading}
                  </StyledAlignCentreHeader>
                  <StyledAlignRightBorderHeader
                    key={'area-1-value'}
                    data-testid={'area-1-Value-header'}
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
                    data-testid={'area-2-Value-header'}
                  >
                    Value
                  </StyledAlignRightHeader>
                </React.Fragment>
              ) : (
                <React.Fragment key={'count-value-for-area'}>
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
                </React.Fragment>
              );
            case SpineChartTableHeadingEnum.GroupValue:
              return !groupIsEngland ? (
                <StyledGroupSubHeader
                  key={heading}
                  data-testid={`${heading}-header`}
                >
                  Value
                </StyledGroupSubHeader>
              ) : null;
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
