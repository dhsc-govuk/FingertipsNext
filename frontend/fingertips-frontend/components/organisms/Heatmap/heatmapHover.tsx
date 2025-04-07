import { GovukColours } from '@/lib/styleHelpers/colours';
import { H5, Paragraph } from 'govuk-react';
import { JSX, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HeatmapBenchmarkProps } from './heatmapUtil';

const StyledDivHover = styled.div({
  color: GovukColours.Black,
  backgroundColor: GovukColours.White,
  boxShadow: `0px 0px 16px 4px ${GovukColours.DarkGrey}`,
  borderRadius: '8px',
  display: 'none',
  zIndex: 2,
  position: 'absolute',
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
    />
  ) : null;
}

function HeatmapHoverInner({
  areaName,
  period,
  indicatorName,
  // value,
  // unitLabel,
  // benchmark,
}: HeatmapHoverProps): JSX.Element {
  return (
    <StyledDivHover>
      <StyledDivTriangle />
      <StyledH5>{areaName}</StyledH5>
      <StyledText>{period}</StyledText>
      <StyledText>{indicatorName}</StyledText>
    </StyledDivHover>
  );
}
