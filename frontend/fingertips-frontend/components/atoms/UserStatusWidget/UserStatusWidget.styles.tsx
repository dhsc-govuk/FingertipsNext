import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
import styled from 'styled-components';

export const StyledParagraph = styled(Paragraph)({
  color: GovukColours.White,
  margin: 0,
  padding: '7px',
  display: 'inline-block',
});
