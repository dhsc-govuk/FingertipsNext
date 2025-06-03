import { GridCol, Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyledDivSquare = styled.div({
  width: '10px',
  height: '10px',
  display: 'block',
});

export const StyledDivSquareBenchmarkColour = styled(StyledDivSquare).attrs<{
  $colour: string;
}>(({ $colour }) => ({
  style: { backgroundColor: `${$colour}`, border: `1px solid ${$colour}` },
}))<{ $colour: string }>(StyledDivSquare);

export const StyledDivSquareBenchmarkNotCompared = styled(StyledDivSquare)({
  backgroundColor: GovukColours.White,
  border: `1px solid ${GovukColours.Black}`,
});

export const StyledText = styled(Paragraph)(
  { marginBottom: '0' },
  typography.font({ size: 16 })
);

export const StyledGridColIcon = styled(GridCol)({
  margin: 'auto',
  verticalAlign: 'middle',
  paddingRight: '4px',
});
