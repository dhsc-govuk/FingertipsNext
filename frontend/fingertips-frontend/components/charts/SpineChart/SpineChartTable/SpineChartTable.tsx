'use client';

import React, { useMemo } from 'react';
import { SpineChartTableHeader } from './SpineChartTableHeader';
import { SpineChartTableRow } from './SpineChartTableRow';
import {
  StyledDivTableContainer,
  StyledTableMultipleAreas,
  StyledTableOneArea,
} from './SpineChartTable.Styles';
import { SpineChartLegend } from '@/components/charts/SpineChart/SpineChartLegend/SpineChartLegend';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { SpineChartIndicatorData } from '../helpers/buildSpineChartIndicatorData';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertSpineChartTableToCsv } from '@/components/charts/SpineChart/helpers/convertSpineChartTableToCsv';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { SubTitle } from '@/components/atoms/SubTitle/SubTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { ChartTitlesEnum } from '@/lib/chartTitleEnums';

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
  const areaNames = sortedData
    .at(0)
    ?.areasHealthData.map((areaHealthData) => areaHealthData?.areaName ?? '');

  const csvData = useMemo(() => {
    return convertSpineChartTableToCsv(sortedData);
  }, [sortedData]);

  if (!indicatorData.length || !areaNames) return null;

  const groupName = sortedData[0].groupData?.areaName;
  const title = `Area profile for ${areaNames.join(' and ')}`;

  const StyledTable =
    areaNames.length > 1 ? StyledTableMultipleAreas : StyledTableOneArea;

  return (
    <>
      <SubTitle id='spine-chart'>{ChartTitlesEnum.SpineChart}</SubTitle>
      <ContainerWithOutline>
        <div id={'spineChartTable'} data-testid="spineChartTable-component">
          <ChartTitle>{title}</ChartTitle>
          <SpineChartLegend
            legendsToShow={methods}
            benchmarkToUse={benchmarkToUse}
            groupName={groupName}
            areaNames={areaNames}
          />

          <StyledDivTableContainer>
            <StyledTable>
              <SpineChartTableHeader
                areaNames={areaNames}
                groupName={sortedData[0].groupData?.areaName ?? 'Group'}
                benchmarkToUse={benchmarkToUse}
              />
              {sortedData.map((indicatorData) => (
                <React.Fragment key={indicatorData.indicatorId}>
                  <SpineChartTableRow
                    indicatorData={indicatorData}
                    twoAreasRequested={areaNames.length > 1}
                    benchmarkToUse={benchmarkToUse}
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
