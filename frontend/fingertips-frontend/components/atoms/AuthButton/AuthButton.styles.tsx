import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
import styled from 'styled-components';

export const InvisibleButton = styled.button({
  background: 'none',
  border: 'none',
  margin: 0,
  padding: 0,
  cursor: 'pointer',
});

export const ButtonText = styled(Paragraph)({
  'margin': 0,
  'color': GovukColours.White,
  'paddingTop': 7,
  'paddingBottom': 7,
  'paddingLeft': 10,
  'paddingRight': 10,
  'cursor': 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
});
