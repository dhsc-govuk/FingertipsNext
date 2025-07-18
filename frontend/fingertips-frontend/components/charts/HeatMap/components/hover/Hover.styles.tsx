import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

export const Hover = styled.div({
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

export const HoverTriangle = styled.div({
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

export const HoverTriangleOccluder = styled.div({
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

export const HoverParagraph = styled(Paragraph)(typography.font({ size: 16 }));
export const HoverParagraphZeroMargin = styled(HoverParagraph)({
  marginBottom: '0',
});
