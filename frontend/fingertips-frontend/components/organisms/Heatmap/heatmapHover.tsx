import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
import { FC } from 'react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { DataCellHoverProps } from './heatmapUtil';
import { HeatmapHoverBenchmarkPill } from './heatmapHoverBenchmarkPill';

const StyledDivHover = styled.div({
  color: GovukColours.Black,
  backgroundColor: GovukColours.White,
  boxShadow: `0px 0px 4px 0px ${GovukColours.DarkGrey}`,
  borderRadius: '8px',
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
    <StyledDivHover style={styles}>
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
