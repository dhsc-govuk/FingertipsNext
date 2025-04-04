import { GovukColours } from '@/lib/styleHelpers/colours';
import { H5, Paragraph } from 'govuk-react';
import { JSX, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HeatmapBenchmarkProps } from './heatmapUtil';

const StyledDivHoverWrapper = styled.div({});
const StyledDivHover = styled.div(
  {
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
  },
  `${StyledDivHoverWrapper}:hover & {
    display: block;
  }
`
);
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
  ${StyledDivHoverWrapper}:hover & {
    display: block;
  }`
);

const StyledH5 = styled(H5)({
  marginBottom: '0',
});

const StyledText = styled(Paragraph)(
  { marginBottom: '0' },
  typography.font({ size: 14 })
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
  children,
  areaName,
  period,
  indicatorName,
  value,
  unitLabel,
  benchmark,
}: HeatmapHoverProps): JSX.Element {
  return (
    <StyledDivHoverWrapper>
      {children}
      <StyledDivTriangle />
      <StyledDivHover>
        <StyledH5>{areaName}</StyledH5>
        <StyledText>{period}</StyledText>
        <StyledText>{indicatorName}</StyledText>
      </StyledDivHover>
    </StyledDivHoverWrapper>
  );
}
