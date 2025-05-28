'use client';
import React, { useMemo } from 'react';

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
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertSpineChartTableToCsv } from '@/components/organisms/SpineChartTable/convertSpineChartTableToCsv';
import { SearchStateParams } from '@/lib/searchStateManager';

const SpineChartHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData[];
  benchmarkToUse: string;
  searchState: SearchStateParams;
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
  searchState,
}: Readonly<SpineChartTableProps>) {
  const sortedData = sortByIndicator(indicatorData);
  const methods = getMethodsAndOutcomes(indicatorData);
  const areaNames = sortedData[0].areasHealthData.map(
    (areaHealthData) => areaHealthData?.areaName ?? ''
  );
  const StyledTable =
    areaNames.length > 1 ? StyledTableMultipleAreas : StyledTableOneArea;

  const csvData = useMemo(() => {
    return convertSpineChartTableToCsv(sortedData);
  }, [sortedData]);

  const groupName = sortedData[0].groupData?.areaName;

  return (
    <>
      <div id={'spineChartTable'}>
        <SpineChartHeading>Compare indicators by areas</SpineChartHeading>
        <SpineChartLegend
          legendsToShow={methods}
          benchmarkToUse={benchmarkToUse}
          groupName={groupName}
          areaNames={areaNames}
          searchState={searchState}
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
      </div>
      <ExportOptionsButton targetId={'spineChartTable'} csvData={csvData} />
    </>
  );
}
