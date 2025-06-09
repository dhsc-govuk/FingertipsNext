import { FC } from 'react';
import { CellHoverProps } from '../../heatmapTypes';
import { HeatmapHoverBenchmarkPill } from './BenchmarkPill';
import {
  StyledDivHover,
  StyledDivTriangle,
  StyledDivTriangleOccluder,
  StyledParagraphZeroMargin,
  StyledParagraph,
} from './Hover.styles';

export interface TransientHeatmapHoverProps extends CellHoverProps {
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
    <StyledDivHover style={styles} className="highcharts-tooltip">
      <StyledDivTriangle />
      <StyledDivTriangleOccluder />
      <StyledParagraphZeroMargin>{`**${areaName}**`}</StyledParagraphZeroMargin>
      {period ? (
        <StyledParagraphZeroMargin>
          {period.toString()}
        </StyledParagraphZeroMargin>
      ) : null}
      <StyledParagraph>{indicatorName}</StyledParagraph>
      <HeatmapHoverBenchmarkPill
        value={value}
        unitLabel={unitLabel}
        outcome={benchmark.outcome}
        benchmarkMethod={benchmark.benchmarkMethod}
        polarity={benchmark.polarity}
        benchmarkAreaName={benchmarkAreaName}
      />
    </StyledDivHover>
  );
};
