import React from 'react';
import { PopulationPyramidTable } from './PopulationPyramidTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertPopulationPyramidTableToCsvData } from '@/components/charts/PopulationPyramid/helpers/convertPopulationPyramidTableToCsvData';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import {
  StyleBenchmarkDataDiv,
  StyleGroupTableContentDiv,
  StylePopulationPyramidTableSection,
  StyleScrollableContentDiv,
  StyleSelectedAreaTableContextDiv,
} from '@/components/charts/PopulationPyramid/PopulationPyramidTable/PopulationPyramidTable.styles';

export interface PopulationPyramidTableProps {
  title: string;
  healthDataForArea: PopulationDataForArea;
  benchmarkData?: PopulationDataForArea;
  groupData?: PopulationDataForArea;
  indicatorId?: string;
  indicatorName?: string;
  period: number;
}

export function PopulationPyramidChartTable({
  title,
  healthDataForArea,
  benchmarkData,
  groupData,
  indicatorId,
  indicatorName,
  period,
}: Readonly<PopulationPyramidTableProps>) {
  const csvData = convertPopulationPyramidTableToCsvData(
    period,
    healthDataForArea,
    indicatorId,
    indicatorName,
    benchmarkData,
    groupData
  );

  return (
    <>
      <div
        id="populationPyramidTable"
        data-testid="populationPyramidTable-component"
      >
        <ChartTitle>{title}</ChartTitle>
        <StylePopulationPyramidTableSection>
          <StyleScrollableContentDiv>
            <StyleSelectedAreaTableContextDiv>
              <PopulationPyramidTable
                headers={['Age range', 'Male', 'Female']}
                title={`${healthDataForArea?.areaName}`}
                healthDataForArea={healthDataForArea}
                filterValues={(row) => {
                  return [row.age, row.male, row.female];
                }}
              />
            </StyleSelectedAreaTableContextDiv>
            {groupData ? (
              <StyleGroupTableContentDiv>
                <PopulationPyramidTable
                  headers={['Male', 'Female']}
                  title={`${groupData?.areaName}`}
                  healthDataForArea={groupData}
                  filterValues={(row) => {
                    return [row.male, row.female];
                  }}
                />
              </StyleGroupTableContentDiv>
            ) : null}
          </StyleScrollableContentDiv>
          {benchmarkData ? (
            <StyleBenchmarkDataDiv>
              <PopulationPyramidTable
                headers={['Male', 'Female']}
                title={benchmarkData?.areaName ?? ''}
                healthDataForArea={benchmarkData}
                filterValues={(row) => {
                  return [row.male, row.female];
                }}
              />
            </StyleBenchmarkDataDiv>
          ) : null}
        </StylePopulationPyramidTableSection>
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton
        targetId={'populationPyramidTable'}
        csvData={csvData}
      />
    </>
  );
}
