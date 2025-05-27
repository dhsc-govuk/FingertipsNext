'use client';

import { HeatmapIndicatorData } from './heatmapUtil';
import { BenchmarkLegends } from '../BenchmarkLegend';
import { HeatmapHover } from './heatmapHover';
import React, { FC } from 'react';
import HeatmapTable from '@/components/organisms/Heatmap/HeatmapTable';
import { useHeatmapTableData } from '@/components/organisms/Heatmap/useHeatmapTableData';
import { useHeatmapHover } from '@/components/organisms/Heatmap/useHeatmapHover';
import styled from 'styled-components';
import { H2 } from 'govuk-react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const HeatmapHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
  benchmarkAreaCode?: string;
}

export const Heatmap: FC<HeatmapProps> = ({
  indicatorData,
  groupAreaCode,
  benchmarkAreaCode,
}) => {
  const { headers, rows, legendsToShow, benchmarkAreaName } =
    useHeatmapTableData(
      indicatorData,
      benchmarkAreaCode ?? areaCodeForEngland,
      groupAreaCode
    );
  const { hover, left, top, handleMouseOverCell } = useHeatmapHover();
  return (
    <>
      <HeatmapHeading>Compare indicators by areas</HeatmapHeading>
      <BenchmarkLegends legendsToShow={legendsToShow} />
      {hover ? (
        <HeatmapHover
          areaName={hover.areaName}
          period={hover.period}
          indicatorName={hover.indicatorName}
          value={hover.value}
          unitLabel={hover.unitLabel}
          benchmarkAreaName={benchmarkAreaName}
          benchmark={hover.benchmark}
          left={left}
          top={top}
        />
      ) : null}
      <HeatmapTable
        headers={headers}
        rows={rows}
        handleMouseOverCell={handleMouseOverCell}
      />
    </>
  );
};
