'use client';

import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React from 'react';

import { PyramidTable } from './PyramidTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

const StylePopulationPyramidTableSection = styled('section')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'justifyContent': 'flex-start',
  'alignItems': 'stretch',
  '& table td, th': {
    borderTopColor: '#F3F2F1',
    borderBottomColor: '#F3F2F1',
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
    '& tr': {
      backgroundColor: 'transparent !important',
      margin: '0px',
      padding: ' 0px',
    },
  },
});

const StyleScrollableContentDiv = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexGrow: 8,
  width: '500px',
  overflow: 'hidden',
  overflowX: 'auto',
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
        <div style={{ flexGrow: 6 }}>
          <PyramidTable
            headers={['Age range', 'Male', 'Female']}
            title={`${healthDataForArea?.areaName}`}
            healthDataForArea={healthDataForArea}
          />
        </div>
        {groupData ? (
          <div style={{ flexGrow: 4, backgroundColor: '#F3F2F1' }}>
            <PyramidTable
              headers={['Male', 'Female']}
              title={`Group: ${groupData?.areaName}`}
              healthDataForArea={groupData}
              filterValues={(columns) => {
                return columns.slice(1);
              }}
            />
          </div>
        ) : null}
      </StyleScrollableContentDiv>
      {benchmarkData ? (
        <StyleBenchmarkDataDiv>
          <PyramidTable
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
