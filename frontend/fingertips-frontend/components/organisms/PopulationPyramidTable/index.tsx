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
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledGreyHeader,
  StyledGreyTableCellValue,
} from '@/lib/tableHelpers';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import { TrendTag } from '@/components/molecules/TrendTag';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { PyramidTable } from './PyramidTable';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { ZodUndefined } from 'zod';

export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  BenchmarkTrend = 'Compared to benchmark',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          flexGrow: 8,
        }}
      >
        <div style={{ flexGrow: 6 }}>
          <PyramidTable
            headers={['Age range', 'Male', 'Female']}
            title={`${groupData?.areaName}`}
            healthDataForArea={groupData}
          />
        </div>
        <div style={{ flexGrow: 4 }}>
          <PyramidTable
            headers={['Male', 'Female']}
            title={`Group: ${groupData?.areaName}`}
            healthDataForArea={groupData}
          />
        </div>
      </div>
      <div style={{ flexGrow: 2 }}>
        <PyramidTable
          headers={['Male', 'Female']}
          title={`Benchmark: ${benchmarkData?.areaName}`}
          healthDataForArea={benchmarkData}
        />
      </div>
    </section>
  );
}
