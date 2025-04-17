import { Table } from 'govuk-react';
import React from 'react';

import {
  StyledAlignCentreHeader,
  StyledGroupHeader,
  StyledGroupSubHeader,
  StyledBenchmarkHeader,
  StyledBenchmarkSubHeader,
  StyledAlignRightBorderHeader,
  StyledStickyEmptyLeftHeader,
  StickyValueUnitHeader,
  StickyPeriodHeader,
  StyledAlignLeftStickyLeftHeader,
  StyledAlignRightHeaderPad,
} from './SpineChartTableStyles';
import { englandAreaString } from '@/lib/chartHelpers/constants';

export interface TableHeaderProps {
  areaNames: string[];
  groupName: string;
}

interface HeaderData {
  title: string;
  uniqueIdentifier: string;
  styledComponent: typeof Table.CellHeader;
}

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicators',
  IndicatorPeriod = 'Period',
  IndicatorUnit = 'Value Unit',
  AreaTrend = 'Recent trend',
  AreaCount = 'Count',
  Value = 'Value',
  BenchmarkWorst = 'Worst/ lowest',
  BenchmarkRange = 'Range',
  BenchmarkBest = 'Best/ highest',
}

const initialHeadersList: HeaderData[] = [
  {
    title: SpineChartTableHeadingEnum.IndicatorName,
    uniqueIdentifier: 'indicator-name-header',
    styledComponent: StyledAlignLeftStickyLeftHeader,
  },
  {
    title: SpineChartTableHeadingEnum.IndicatorPeriod,
    uniqueIdentifier: 'indicator-period-header',
    styledComponent: StickyPeriodHeader,
  },
  {
    title: SpineChartTableHeadingEnum.IndicatorUnit,
    uniqueIdentifier: 'indicator-unit-header',
    styledComponent: StickyValueUnitHeader,
  },
];

const benchmarkHeaderList: HeaderData[] = [
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'benchmark-value-header',
    styledComponent: StyledBenchmarkSubHeader,
  },
  {
    title: SpineChartTableHeadingEnum.BenchmarkWorst,
    uniqueIdentifier: 'benchmark-worst-header',
    styledComponent: StyledBenchmarkSubHeader,
  },
  {
    title: SpineChartTableHeadingEnum.BenchmarkRange,
    uniqueIdentifier: 'benchmark-range-header',
    styledComponent: StyledBenchmarkHeader,
  },
  {
    title: SpineChartTableHeadingEnum.BenchmarkBest,
    uniqueIdentifier: 'benchmark-best-header',
    styledComponent: StyledBenchmarkSubHeader,
  },
];

const oneAreaHeadingsList: HeaderData[] = [
  ...initialHeadersList,
  {
    title: SpineChartTableHeadingEnum.AreaTrend,
    uniqueIdentifier: 'area-trend-header',
    styledComponent: StyledAlignCentreHeader,
  },
  {
    title: SpineChartTableHeadingEnum.AreaCount,
    uniqueIdentifier: 'area-count-header',
    styledComponent: StyledAlignRightHeaderPad,
  },
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'area-value-header',
    styledComponent: StyledAlignRightBorderHeader,
  },
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'group-value-header',
    styledComponent: StyledGroupSubHeader,
  },
  ...benchmarkHeaderList,
];

const twoAreasHeadingsList: HeaderData[] = [
  ...initialHeadersList,
  {
    title: SpineChartTableHeadingEnum.AreaCount,
    uniqueIdentifier: 'area-1-count-header',
    styledComponent: StyledAlignRightHeaderPad,
  },
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'area-1-value-header',
    styledComponent: StyledAlignRightBorderHeader,
  },
  {
    title: SpineChartTableHeadingEnum.AreaCount,
    uniqueIdentifier: 'area-2-count-header',
    styledComponent: StyledAlignRightHeaderPad,
  },
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'area-2-value-header',
    styledComponent: StyledAlignRightBorderHeader,
  },
  {
    title: SpineChartTableHeadingEnum.Value,
    uniqueIdentifier: 'group-value-header',
    styledComponent: StyledGroupSubHeader,
  },
  ...benchmarkHeaderList,
];

const getBenchmarkSubHeaderData = (
  twoAreasRequested: boolean,
  showGroupData: boolean
) => {
  const relevantHeaderList = twoAreasRequested
    ? twoAreasHeadingsList
    : oneAreaHeadingsList;

  return showGroupData
    ? relevantHeaderList
    : relevantHeaderList.filter(
        (headerData) => headerData.uniqueIdentifier !== 'group-value-header'
      );
};

export function SpineChartTableHeader({
  areaNames,
  groupName,
}: Readonly<TableHeaderProps>) {
  const twoAreasRequested = areaNames.length === 2;
  const showGroupData = groupName !== englandAreaString;
  const benchmarkSubHeaderData = getBenchmarkSubHeaderData(
    twoAreasRequested,
    showGroupData
  );

  return (
    <>
      <Table.Row key={`${areaNames.concat()}`}>
        <StyledStickyEmptyLeftHeader
          colSpan={3}
          data-testid="empty-header"
        ></StyledStickyEmptyLeftHeader>
        {areaNames.map((areaName, index) => (
          <StyledAlignCentreHeader
            colSpan={twoAreasRequested ? 2 : 3}
            data-testid={`area-header-${index + 1}`}
            key={areaName}
          >
            {areaName}
          </StyledAlignCentreHeader>
        ))}
        {showGroupData ? (
          <StyledGroupHeader data-testid="group-header">
            {groupName}
          </StyledGroupHeader>
        ) : null}
        <StyledBenchmarkHeader colSpan={4} data-testid="england-header">
          Benchmark: England
        </StyledBenchmarkHeader>
      </Table.Row>
      <Table.Row>
        {benchmarkSubHeaderData.map((subHeader) => (
          <subHeader.styledComponent
            key={subHeader.uniqueIdentifier}
            data-testid={subHeader.uniqueIdentifier}
          >
            {subHeader.title}
          </subHeader.styledComponent>
        ))}
      </Table.Row>
    </>
  );
}
