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
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

const HeatmapHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

export const Heatmap: FC<HeatmapProps> = ({ indicatorData, groupAreaCode }) => {
  const { headers, rows, legendsToShow } = useHeatmapTableData(
    indicatorData,
    groupAreaCode
  );
  const { hover, left, top, handleMouseOverCell } = useHeatmapHover();
  const csvData: CsvData = [];
  return (
    <>
      <div id={'heatmap'}>
        <HeatmapHeading>Compare indicators by areas</HeatmapHeading>
        <BenchmarkLegends legendsToShow={legendsToShow} />
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
      </div>
      <ExportOptionsButton targetId={'heatmap'} csvData={csvData} />
    </>
  );
};
