import { GovukColours } from '@/lib/styleHelpers/colours';
import { H5, Paragraph } from 'govuk-react';
import { JSX, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HeatmapBenchmarkProps } from './heatmapUtil';
import { number } from 'zod';

interface PositionProps {
  $xPos: number;
  $yPos: number;
}

const StyledDivHover = styled.div.attrs<PositionProps>(({ $xPos, $yPos }) => ({
  style: {
    left: `${$xPos}px`,
    top: `${$yPos}px`,
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
  whiteSpace: 'nowrap',
  overflow: 'hidden',
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

const StyledH5 = styled(H5)(
  { marginBottom: '0' },
  typography.font({ size: 16 })
);

const StyledText = styled(Paragraph)(
  { marginBottom: '0' },
  typography.font({ size: 16 })
);

export interface HeatmapHoverProps extends PropsWithChildren {
  areaName: string;
  period: string;
  indicatorName: string;
  value: string;
  unitLabel: string;
  benchmark: HeatmapBenchmarkProps;
  xPos?: number;
  yPos?: number;
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
}: HeatmapHoverProps): JSX.Element {
  return (
    <StyledDivHover $xPos={xPos ?? 0} $yPos={yPos ?? 0}>
      <StyledDivTriangle />
      <StyledH5>{areaName}</StyledH5>
      <StyledText>{period}</StyledText>
      <StyledText>{indicatorName}</StyledText>
    </StyledDivHover>
  );
}
