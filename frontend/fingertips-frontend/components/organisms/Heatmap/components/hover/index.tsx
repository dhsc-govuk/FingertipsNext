import { FC } from 'react';
import { DataCellHoverProps } from '../../heatmapUtil';
import { HeatmapHoverBenchmarkPill } from './BenchmarkPill';
import {
  Hover,
  HoverTriangle,
  HoverTriangleOccluder,
  HoverParagraphZeroMargin,
  HoverParagraph,
} from './Hover.styles';

export interface TransientHeatmapHoverProps extends DataCellHoverProps {
  areaName: string;
  left?: number;
  top?: number;
}

interface HeatmapHoverProps extends TransientHeatmapHoverProps {
  benchmarkAreaName: string;
}

export const HeatmapHover: FC<HeatmapHoverProps> = ({
  areaName,
  period,
  indicatorName,
  value,
  unitLabel,
  benchmark,
  benchmarkAreaName,
  left,
  top,
}) => {
  const styles = {
    left: `${left}px`,
    top: `${top}px`,
  };
  return (
    <Hover style={styles} className="highcharts-tooltip">
      <HoverTriangle />
      <HoverTriangleOccluder />
      <HoverParagraphZeroMargin>{`**${areaName}**`}</HoverParagraphZeroMargin>
      {period ? (
        <HoverParagraphZeroMargin>{period.toString()}</HoverParagraphZeroMargin>
      ) : null}
      <HoverParagraph>{indicatorName}</HoverParagraph>
      <HeatmapHoverBenchmarkPill
        value={value}
        unitLabel={unitLabel}
        outcome={benchmark.outcome}
        benchmarkMethod={benchmark.benchmarkMethod}
        polarity={benchmark.polarity}
        benchmarkAreaName={benchmarkAreaName}
      />
    </Hover>
  );
};
