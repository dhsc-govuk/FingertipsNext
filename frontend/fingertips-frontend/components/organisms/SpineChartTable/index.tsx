'use client';
import React from 'react';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import { SpineChartTableRow } from './SpineChartTableRow';
import {
  StyledDivTableContainer,
  StyledTableMultipleAreas,
  StyledTableOneArea,
} from './SpineChartTableStyles';
import { H2 } from 'govuk-react';
import styled from 'styled-components';
import { SpineChartLegend } from '@/components/organisms/SpineChartLegend/SpineChartLegend';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';

const SpineChartHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData[];
  benchmarkToUse: string;
}

const sortByIndicator = (indicatorData: SpineChartIndicatorData[]) =>
  indicatorData.toSorted((a, b) =>
    a.indicatorName?.localeCompare(b.indicatorName, 'en', {
      sensitivity: 'base',
    })
  );

export function SpineChartTable({
  indicatorData,
  benchmarkToUse,
}: Readonly<SpineChartTableProps>) {
  const sortedData = sortByIndicator(indicatorData);
  const methods = getMethodsAndOutcomes(indicatorData);
  const areaNames = sortedData[0].areasHealthData.map(
    (areaHealthData) => areaHealthData?.areaName ?? ''
  );
  const StyledTable =
    areaNames.length > 1 ? StyledTableMultipleAreas : StyledTableOneArea;

  const groupName = sortedData[0].groupData?.areaName;

  const benchmarkName =
    benchmarkToUse === areaCodeForEngland
      ? `Benchmark: ${englandAreaString}`
      : `Benchmark: ${groupName}`;

  const alternativeBenchmarkName =
    benchmarkToUse === areaCodeForEngland
      ? `Group: ${groupName}`
      : englandAreaString;

  return (
    <>
      <SpineChartHeading>Compare indicators by areas</SpineChartHeading>
      <SpineChartLegend
        benchmarkName={benchmarkName}
        legendsToShow={methods}
        groupName={alternativeBenchmarkName}
        areaNames={areaNames}
      />

      <StyledDivTableContainer data-testid="spineChartTable-component">
        <StyledTable>
          <SpineChartTableHeader
            areaNames={areaNames}
            groupName={sortedData[0].groupData?.areaName ?? 'Group'}
          />
          {sortedData.map((indicatorData) => (
            <React.Fragment key={indicatorData.indicatorId}>
              <SpineChartTableRow
                indicatorData={indicatorData}
                twoAreasRequested={areaNames.length > 1}
              />
            </React.Fragment>
          ))}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
