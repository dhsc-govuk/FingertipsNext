import styled from 'styled-components';
import { Paragraph } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const StyledTitleParagraph = styled(styled(Paragraph)`
  padding-bottom: 2px;
`)(spacing.withWhiteSpace({ marginBottom: 0 }));

export const StyledHintParagraph = styled(styled(Paragraph)`
  color: ${GovukColours.DarkGrey};
`)(spacing.withWhiteSpace({ marginBottom: 3 }));
