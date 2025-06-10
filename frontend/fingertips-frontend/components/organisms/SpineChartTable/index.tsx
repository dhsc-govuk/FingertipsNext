'use client';

import React, { useMemo } from 'react';
import { SpineChartTableHeader } from './SpineChartTableHeader';
import { SpineChartTableRow } from './SpineChartTableRow';
import {
  StyledDivTableContainer,
  StyledTableMultipleAreas,
  StyledTableOneArea,
} from './SpineChartTable.Styles';
import { SpineChartLegend } from '@/components/organisms/SpineChartLegend/SpineChartLegend';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertSpineChartTableToCsv } from '@/components/organisms/SpineChartTable/convertSpineChartTableToCsv';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { SearchStateParams } from '@/lib/searchStateManager';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { SubTitle } from '@/components/atoms/SubTitle/SubTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';

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
  const title = `Area profile for ${areaNames.join(' and ')}`;

  return (
    <>
      <SubTitle>Compare indicators by areas</SubTitle>
      <ContainerWithOutline>
        <div id={'spineChartTable'}>
          <ChartTitle>{title}</ChartTitle>
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
                benchmarkToUse={benchmarkToUse}
                searchState={searchState}
              />
              {sortedData.map((indicatorData) => (
                <React.Fragment key={indicatorData.indicatorId}>
                  <SpineChartTableRow
                    indicatorData={indicatorData}
                    twoAreasRequested={areaNames.length > 1}
                    benchmarkToUse={benchmarkToUse}
                    searchState={searchState}
                  />
                </React.Fragment>
              ))}
            </StyledTable>
          </StyledDivTableContainer>
          <ExportOnlyWrapper>
            <ExportCopyright />
          </ExportOnlyWrapper>
        </div>
        <ExportOptionsButton targetId={'spineChartTable'} csvData={csvData} />
      </ContainerWithOutline>
    </>
  );
}
