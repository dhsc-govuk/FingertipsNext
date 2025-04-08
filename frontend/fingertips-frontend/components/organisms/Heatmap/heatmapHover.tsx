import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
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
  zIndex: 1,
  position: 'fixed',
  textAlign: 'left',
  padding: '16px',
  whiteSpace: 'normal',
  overflow: 'visible',
  maxWidth: '240px',
  transform: 'translateY(-50%)',
});

const StyledDivTriangle = styled.div({
  backgroundColor: GovukColours.White,
  boxShadow: `0px 0px 4px 0px ${GovukColours.DarkGrey}`,
  borderRadius: '2px',
  display: 'block',
  zIndex: 1,
  position: 'absolute',
  width: '16px',
  height: '16px',
  left: '-8px',
  top: '50%',
  transform: 'translateX(1px) translateY(-8px) rotate(45deg)',
  border: 'none',
});

const StyledDivTriangleOccluder = styled.div({
  backgroundColor: GovukColours.White,
  display: 'block',
  zIndex: 2,
  position: 'absolute',
  width: '16px',
  height: '24px',
  left: '0px',
  top: '50%',
  transform: 'translateY(-12px)',
});

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
  cellRight?: number;
  cellVerticalMidpoint?: number;
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
      cellRight={hoverProps.cellRight}
      cellVerticalMidpoint={hoverProps.cellVerticalMidpoint}
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
  cellRight,
  cellVerticalMidpoint,
}: HeatmapHoverProps): JSX.Element {
  return (
    <StyledDivHover $left={cellRight ?? 0} $top={cellVerticalMidpoint ?? 0}>
      <StyledDivTriangle />
      <StyledDivTriangleOccluder />
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
