'use client';

import { HeatmapIndicatorData } from './heatmapUtil';
import { BenchmarkLegend } from '../BenchmarkLegend';
import { HeatmapHover } from './heatmapHover';
import React, { FC } from 'react';
import HeatmapTable from '@/components/organisms/Heatmap/HeatmapTable';
import { useHeatmapTableData } from '@/components/organisms/Heatmap/useHeatmapTableData';
import { useHeatmapHover } from '@/components/organisms/Heatmap/useHeatmapHover';

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

export const Heatmap: FC<HeatmapProps> = ({ indicatorData, groupAreaCode }) => {
  const { headers, rows } = useHeatmapTableData(indicatorData, groupAreaCode);
  const { hover, left, top, handleMouseOverCell } = useHeatmapHover();
  return (
    <>
      <BenchmarkLegend />
      {hover ? (
        <HeatmapHover
          areaName={hover.areaName}
          period={hover.period}
          indicatorName={hover.indicatorName}
          value={hover.value}
          unitLabel={hover.unitLabel}
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
