'use client';

import { HeatmapIndicatorData } from './heatmap.types';
import { HeatmapHover } from './components/hover';
import React, { FC } from 'react';
import HeatmapTable from '@/components/charts/HeatMap/components/HeatmapTable';
import { useHeatmapTableData } from '@/components/charts/HeatMap/hooks/useHeatmapTableData';
import { useHeatmapHover } from '@/components/charts/HeatMap/hooks/useHeatmapHover';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

export interface HeatMapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode: string;
  benchmarkAreaCode: string;
  benchmarkAreaName: string;
  title?: string;
}

export const HeatMap: FC<HeatMapProps> = ({
  indicatorData,
  groupAreaCode,
  benchmarkAreaCode,
  benchmarkAreaName,
  title = chartTitleConfig[ChartTitleKeysEnum.Heatmap].subTitle,
}) => {
  const { headers, rows, legendsToShow, csvData } = useHeatmapTableData(
    indicatorData,
    groupAreaCode,
    benchmarkAreaCode
  );

  const { hover, left, top, handleMouseOverCell } = useHeatmapHover();

  const id = ChartTitleKeysEnum.Heatmap;

  return (
    <ContainerWithOutline>
      <div id={id} data-testid={`heatmap-chart-component`}>
        <ChartTitle>{title}</ChartTitle>
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
      <ExportOptionsButton targetId={id} csvData={csvData} />
    </ContainerWithOutline>
  );
};
export { extractHeatmapIndicatorData } from '@/components/charts/HeatMap/helpers/extractHeatMapIndicatorData';
