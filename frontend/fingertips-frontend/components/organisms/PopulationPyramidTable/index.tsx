'use client';

import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React from 'react';

import { PopulationDataTable } from './PopulationDataTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

const StylePopulationPyramidTableSection = styled('section')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'justifyContent': 'flex-start',
  'alignItems': 'stretch',
  '& table ': {
    margin: '0px !important',
    border: '0px',
    padding: '0px',
  },
});

const StyleBenchmarkDataDiv = styled('div')({
  'flexGrow': 2,
  'marginLeft': 'auto',
  'backgroundColor': '#B1B4B6',
  '& table ': {
    'margin': '0px',
    'border': '0px',
    'padding': '0px',
    '& td, th': {
      borderBottomColor: ' #F3F2F1',
      borderTopColor: '#F3F2F1',
    },
  },
  'minWidth': 200,
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
  'backgroundColor': '#F3F2F1',
  '& table ': {
    'margin': '0px',

    '& td, th': {
      borderBottomColor: ' #B1B4B6',
      borderTopColor: '#B1B4B6',
    },
  },
  'minWidth': 200,
});

const StyleSelectedAreaTableContextDiv = styled('div')({
  'flexGrow': 8,
  'minWidth': 300,
  '& table': {
    '& td, th': {
      borderTopColor: '#B1B4B6',
      borderBottomColor: '#B1B4B6',
    },
  },
});

export interface PopulationPyramidTableProps {
  healthDataForArea: PopulationDataForArea;
  benchmarkData: PopulationDataForArea | undefined;
  groupData?: PopulationDataForArea | undefined;
}

export interface LineChartTableRowData {
  period: number;
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
}

export function PopulationPyramidTable({
  healthDataForArea,
  benchmarkData,
  groupData,
}: Readonly<PopulationPyramidTableProps>) {
  return (
    <StylePopulationPyramidTableSection>
      <StyleScrollableContentDiv>
        <StyleSelectedAreaTableContextDiv>
          <PopulationDataTable
            headers={['Age range', 'Male', 'Female']}
            title={`${healthDataForArea?.areaName}`}
            healthDataForArea={healthDataForArea}
          />
        </StyleSelectedAreaTableContextDiv>
        {groupData ? (
          <StyleGroupTableContentDiv>
            <PopulationDataTable
              headers={['Male', 'Female']}
              title={`${groupData?.areaName}`}
              healthDataForArea={groupData}
              filterValues={(columns) => {
                return columns.slice(1);
              }}
            />
          </StyleGroupTableContentDiv>
        ) : null}
      </StyleScrollableContentDiv>
      {benchmarkData ? (
        <StyleBenchmarkDataDiv>
          <PopulationDataTable
            headers={['Male', 'Female']}
            title={`Benchmark: ${benchmarkData?.areaName}`}
            healthDataForArea={benchmarkData}
            filterValues={(columns) => {
              return columns.slice(1);
            }}
          />
        </StyleBenchmarkDataDiv>
      ) : null}
    </StylePopulationPyramidTableSection>
  );
}
