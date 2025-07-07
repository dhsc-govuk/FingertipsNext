import styled from 'styled-components';
import { Label } from 'govuk-react';

export const StyledLabel = styled(Label)({
  'fontWeight': 'bold',
  'fontSize': '19px',
  'paddingBottom': '2px',
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'greyscale',
});

export const InlineDropDownsContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  label: {
    span: {
      display: 'none',
    },
  },
});
