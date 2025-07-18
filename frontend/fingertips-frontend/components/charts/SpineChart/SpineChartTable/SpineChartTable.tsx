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
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData[];
  benchmarkToUse: string;
}

export function SpineChartTable({
  indicatorData,
  benchmarkToUse,
}: Readonly<SpineChartTableProps>) {
  const methods = getMethodsAndOutcomes(indicatorData);
  const areaNames = indicatorData
    .at(0)
    ?.areasHealthData.map((areaHealthData) => areaHealthData?.areaName ?? '');

  const csvData = useMemo(() => {
    return convertSpineChartTableToCsv(indicatorData);
  }, [indicatorData]);

  if (!indicatorData.length || !areaNames) return null;

  const groupName = indicatorData[0].groupData?.areaName;
  const title = `Area profile for ${areaNames.join(' and ')}`;

  const StyledTable =
    areaNames.length > 1 ? StyledTableMultipleAreas : StyledTableOneArea;

  return (
    <>
      <SubTitle id={ChartTitleKeysEnum.SpineChart}>
        {chartTitleConfig[ChartTitleKeysEnum.SpineChart].title}
      </SubTitle>
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
                groupName={indicatorData[0].groupData?.areaName ?? 'Group'}
                benchmarkToUse={benchmarkToUse}
              />
              {indicatorData.map((indicatorData) => (
                <React.Fragment key={indicatorData.rowId}>
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
