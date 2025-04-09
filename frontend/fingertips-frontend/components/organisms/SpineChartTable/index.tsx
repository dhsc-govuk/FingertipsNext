'use client';
import React from 'react';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import {
  SpineChartTableRow
} from './SpineChartTableRow';
import { StyledDivTableContainer, StyledTable } from './SpineChartTableStyles';
import { H2 } from 'govuk-react';
import styled from 'styled-components';
import { SpineChartLegend } from '@/components/organisms/SpineChartLegend/SpineChartLegend';
import { SpineChartQuartilesInfoContainer } from '@/components/organisms/SpineChart/SpineChartQuartilesInfo';
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
  // TODO: Is this a requirement? Or would we want to sort by indicator name
  indicatorData.toSorted((a, b) => Number(a.indicatorId) - Number(b.indicatorId));

export function SpineChartTable({
  indicatorData
}: Readonly<SpineChartTableProps>) {
  const sortedData = sortByIndicator(indicatorData);
  const areaNames = sortedData[0].areasHealthData.map((areaHealthData) => areaHealthData.areaName);
  const methods = getMethodsAndOutcomes(indicatorData);

  return (
    <>
      <SpineChartHeading>Compare indicators by areas</SpineChartHeading>
      <SpineChartLegend
        legendsToShow={methods}
        groupName={sortedData[0].groupData.areaName}
        areaNames={areaNames}
      />
      <SpineChartQuartilesInfoContainer />
      <StyledDivTableContainer data-testid="spineChartTable-component">
        <StyledTable>
        <SpineChartTableHeader
          areaNames={areaNames}
          groupName={sortedData[0].groupData.areaName}
        />
        {sortedData.map((indicatorData) => (
          <React.Fragment key={indicatorData.indicatorId}>
            <SpineChartTableRow
              indicatorData={indicatorData}
            />
          </React.Fragment>
        ))}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
