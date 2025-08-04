import React from 'react';
import { PopulationPyramidTable } from './PopulationPyramidTable';
import { PopulationDataForArea } from '@/components/charts/PopulationPyramid/helpers/preparePopulationData';
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
  populationDataForArea?: PopulationDataForArea;
  populationDataForBenchmark?: PopulationDataForArea;
  populationDataForGroup?: PopulationDataForArea;
  indicatorId?: string;
  indicatorName?: string;
  period: number;
}

export function PopulationPyramidChartTable({
  title,
  populationDataForArea,
  populationDataForBenchmark,
  populationDataForGroup,
  indicatorId,
  indicatorName,
  period,
}: Readonly<PopulationPyramidTableProps>) {
  const csvData = convertPopulationPyramidTableToCsvData(
    period,
    populationDataForArea,
    indicatorId,
    indicatorName,
    populationDataForBenchmark,
    populationDataForGroup
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
                title={`${populationDataForArea?.areaName}`}
                healthDataForArea={populationDataForArea}
                filterValues={(row) => {
                  return [row.age, row.male, row.female];
                }}
              />
            </StyleSelectedAreaTableContextDiv>
            {populationDataForGroup ? (
              <StyleGroupTableContentDiv>
                <PopulationPyramidTable
                  headers={['Male', 'Female']}
                  title={`${populationDataForGroup?.areaName}`}
                  healthDataForArea={populationDataForGroup}
                  filterValues={(row) => {
                    return [row.male, row.female];
                  }}
                />
              </StyleGroupTableContentDiv>
            ) : null}
          </StyleScrollableContentDiv>
          {populationDataForBenchmark ? (
            <StyleBenchmarkDataDiv>
              <PopulationPyramidTable
                headers={['Male', 'Female']}
                title={populationDataForBenchmark?.areaName ?? ''}
                healthDataForArea={populationDataForBenchmark}
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
