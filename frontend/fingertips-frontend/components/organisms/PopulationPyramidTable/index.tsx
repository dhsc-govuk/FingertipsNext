'use client';

import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React from 'react';

import { PyramidTable } from './PyramidTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

const StylePopulationPyramidTableSection = styled('section')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
    'minWidth': 180,
});

const StyleScrollableContentDiv = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 8,
    maxWidth: '600px',
    overflow: 'hidden',
    clear: "both",
    overflowX: 'auto',
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
    'minWidth': 180,
});

const StyleSelectedAreaTableContextDiv = styled('div')({
    'flexGrow': 8,
    'minWidth': 230,
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
                    <PyramidTable
                        headers={['Age range', 'Male', 'Female']}
                        title={`${healthDataForArea?.areaName}`}
                        healthDataForArea={healthDataForArea}
                    />
                </StyleSelectedAreaTableContextDiv>
                {groupData ? (
                    <StyleGroupTableContentDiv>
                        <PyramidTable
                            headers={['Male', 'Female']}
                            title={`Group: ${groupData?.areaName}`}
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
