'use client';
import styled from 'styled-components';
import React from 'react';
import { PopulationDataTable } from './PopulationDataTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertPopulationPyramidTableToCsvData } from '@/components/organisms/PopulationPyramid/convertPopulationPyramidTableToCsvData';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';

const DefaultMinimumWidthForTablePanel = 250;

const StylePopulationPyramidTableSection = styled('section')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'justifyContent': 'flex-start',
  'alignItems': 'stretch',
  'marginBottom': '1rem',
  '& table ': {
    'margin': '0px !important',
    'border': '0px',

    '& th': {
      padding: '10px !important',
    },
    '& td': {
      padding: '10px 10px 10px 0px !important',
    },
  },
});

const StyleBenchmarkDataDiv = styled('div')({
  'flexGrow': 2,
  'marginLeft': 'auto',
  'backgroundColor': GovukColours.MidGrey,
  '& table ': {
    '& td, th': {
      borderBottomColor: GovukColours.LightGrey,
      borderTopColor: GovukColours.LightGrey,
      textAlign: 'right',
    },
  },
  'minWidth': DefaultMinimumWidthForTablePanel,
  '& h3': {
    textAlign: 'center',
  },
});

const StyleScrollableContentDiv = styled('div')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'flexGrow': 8,
  'overflow': 'hidden',
  'clear': 'both',
  '@media only screen and (min-width: 480px)': {
    overflowX: 'auto',
  },
});

const StyleGroupTableContentDiv = styled('div')({
  'flexGrow': 2,
  'backgroundColor': GovukColours.LightGrey,
  '& table ': {
    '& td, th': {
      borderBottomColor: GovukColours.MidGrey,
      borderTopColor: GovukColours.MidGrey,
      textAlign: 'right',
    },
  },
  'minWidth': DefaultMinimumWidthForTablePanel,
});

const StyleSelectedAreaTableContextDiv = styled('div')({
  'flexGrow': 8,
  'minWidth': DefaultMinimumWidthForTablePanel + 40,
  '& table': {
    '& td:first-child, th:first-child': {
      minWidth: '90px',
      textAlign: 'left',
      paddingLeft: '10px !important',
    },
    '& td, th': {
      borderTopColor: GovukColours.MidGrey,
      borderBottomColor: GovukColours.MidGrey,
      textAlign: 'right',
    },
  },
});

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
              <PopulationDataTable
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
                <PopulationDataTable
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
              <PopulationDataTable
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
