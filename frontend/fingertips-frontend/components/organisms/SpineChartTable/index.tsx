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

const SpineChartHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData[];
}

const sortByIndicator = (indicatorData: SpineChartIndicatorData[]) =>
  indicatorData.toSorted((a, b) =>
    a.indicatorName?.localeCompare(b.indicatorName, 'en', {
      sensitivity: 'base',
    })
  );

export function SpineChartTable({
  indicatorData,
}: Readonly<SpineChartTableProps>) {
  const sortedData = sortByIndicator(indicatorData);
  const methods = getMethodsAndOutcomes(indicatorData);
  const areaNames = sortedData[0].areasHealthData.map(
    (areaHealthData) => areaHealthData?.areaName ?? ''
  );
  const StyledTable =
    areaNames.length > 1 ? StyledTableMultipleAreas : StyledTableOneArea;

  return (
    <>
      <SpineChartHeading>Compare indicators by areas</SpineChartHeading>
      <SpineChartLegend
        legendsToShow={methods}
        groupName={sortedData[0].groupData?.areaName}
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
              <SpineChartTableRow indicatorData={indicatorData} />
            </React.Fragment>
          ))}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
