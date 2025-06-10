import { GridCol, Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { GovukColours } from '@/lib/styleHelpers/colours';

const BenchmarkIcon = styled.div({
  width: '10px',
  height: '10px',
  display: 'block',
});

export const ColouredBenchmarkIcon = styled(BenchmarkIcon).attrs<{
  $colour: string;
}>(({ $colour }) => ({
  style: { backgroundColor: `${$colour}`, border: `1px solid ${$colour}` },
}))<{ $colour: string }>(BenchmarkIcon);

export const NotComparedBenchmarkIcon = styled(BenchmarkIcon)({
  backgroundColor: GovukColours.White,
  border: `1px solid ${GovukColours.Black}`,
});

export const BenchmarkPillText = styled(Paragraph)(
  { marginBottom: '0' },
  typography.font({ size: 16 })
);

export const IconGridCol = styled(GridCol)({
  margin: 'auto',
  verticalAlign: 'middle',
  paddingRight: '4px',
});
