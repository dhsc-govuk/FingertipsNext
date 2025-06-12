'use client';

import { HeatmapIndicatorData } from './heatmapUtil';
import { HeatmapHover } from './components/hover';
import React, { FC } from 'react';
import HeatmapTable from '@/components/organisms/Heatmap/components/HeatmapTable';
import { useHeatmapTableData } from '@/components/organisms/Heatmap/useHeatmapTableData';
import { useHeatmapHover } from '@/components/organisms/Heatmap/useHeatmapHover';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode: string;
  benchmarkAreaCode: string;
  benchmarkAreaName: string;
}

export const Heatmap: FC<HeatmapProps> = ({
  indicatorData,
  groupAreaCode,
  benchmarkAreaCode,
  benchmarkAreaName,
}) => {
  const { headers, rows, legendsToShow, csvData } = useHeatmapTableData(
    indicatorData,
    groupAreaCode,
    benchmarkAreaCode
  );
  const { hover, left, top, handleMouseOverCell } = useHeatmapHover();

  return (
    <ContainerWithOutline>
      <div id={'heatmap'} data-testid="heatmapChart-component">
        <ChartTitle>Overview of selected indicators</ChartTitle>
        <BenchmarkLegends
          title={`Compared to ${benchmarkAreaName}`}
          legendsToShow={legendsToShow}
        />
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
            benchmarkAreaName={benchmarkAreaName}
          />
        ) : null}
        <HeatmapTable
          headers={headers}
          rows={rows}
          handleMouseOverCell={handleMouseOverCell}
        />
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton targetId={'heatmap'} csvData={csvData} />
    </ContainerWithOutline>
  );
};
