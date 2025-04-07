import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph, SectionBreak } from 'govuk-react';
import { JSX, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HeatmapBenchmarkProps } from './heatmapUtil';
import { HeatmapHoverBenchmarkPill } from './heatmapHoverBenchmarkPill';

interface PositionProps {
  $left: number;
  $top: number;
}

const StyledDivHover = styled.div.attrs<PositionProps>(({ $left, $top }) => ({
  style: {
    left: `${$left}px`,
    top: `${$top}px`,
  },
}))<PositionProps>({
  color: GovukColours.Black,
  backgroundColor: GovukColours.White,
  boxShadow: `0px 0px 4px 0px ${GovukColours.DarkGrey}`,
  borderRadius: '8px',
  display: 'block',
  zIndex: 2,
  position: 'fixed',
  textAlign: 'left',
  padding: '16px',
  whiteSpace: 'normal',
  overflow: 'hidden',
  maxWidth: '240px',
});

const StyledDivTriangle = styled.div(
  {
    backgroundColor: GovukColours.White,
    display: 'none',
    position: 'absolute',
    width: '16px',
    height: '16px',
    left: '-8px',
    transform: `rotate(45deg)`,
  },
  `
  ${StyledDivHover}:before;
  }`
);

const StyledParagraph = styled(Paragraph)(typography.font({ size: 16 }));
const StyledParagraphZeroMargin = styled(StyledParagraph)({
  marginBottom: '0',
});

export interface HeatmapHoverProps extends PropsWithChildren {
  areaName: string;
  period: string;
  indicatorName: string;
  value: string;
  unitLabel: string;
  benchmark: HeatmapBenchmarkProps;
  xPos?: number;
  yPos?: number;
  anchor?: 'left' | 'right';
}

export function HeatmapHover({
  hoverProps,
}: {
  hoverProps?: HeatmapHoverProps;
}): ReactNode {
  return hoverProps ? (
    <HeatmapHoverInner
      areaName={hoverProps.areaName}
      period={hoverProps.period}
      indicatorName={hoverProps.indicatorName}
      value={hoverProps.value}
      unitLabel={hoverProps.unitLabel}
      benchmark={hoverProps.benchmark}
      xPos={hoverProps.xPos}
      yPos={hoverProps.yPos}
      anchor={hoverProps.anchor}
    />
  ) : null;
}

function HeatmapHoverInner({
  areaName,
  period,
  indicatorName,
  value,
  unitLabel,
  benchmark,
  xPos,
  yPos,
  anchor = 'left',
}: HeatmapHoverProps): JSX.Element {
  return (
    <StyledDivHover $left={xPos ?? 0} $top={yPos ?? 0}>
      <StyledDivTriangle />
      <StyledParagraphZeroMargin>{`**${areaName}**`}</StyledParagraphZeroMargin>
      <StyledParagraphZeroMargin>{period}</StyledParagraphZeroMargin>
      <StyledParagraph>{indicatorName}</StyledParagraph>
      <HeatmapHoverBenchmarkPill
        value={value}
        unitLabel={unitLabel}
        outcome={benchmark.outcome}
        benchmarkMethod={benchmark.benchmarkMethod}
        polarity={benchmark.polarity}
      />
    </StyledDivHover>
  );
}
