'use client';

import { Table } from 'govuk-react';
import {
    BenchmarkComparisonMethod,
    HealthDataForArea,
    HealthDataPointBenchmarkComparison,
    IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { PyramidTable } from './PyramidTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

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

const ScrollableContentDiv = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 8,
    width: '500px',
    overflow: 'hidden',
    scrollbarWidth: '20px',
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
    measurementUnit,
}: Readonly<PopulationPyramidTableProps>) {
    return (
        <section
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
            }}
        >
            <ScrollableContentDiv>
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
            </ScrollableContentDiv>
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
        </section>
    );
}
