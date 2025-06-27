import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

export const StyledAuthButton = styled.button(
  {
    'background': 'none',
    'border': 'none',
    'color': GovukColours.White,
    'margin': 0,
    'paddingTop': 7,
    'paddingBottom': 7,
    'paddingLeft': 10,
    'paddingRight': 10,
    'cursor': 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  typography.font({ size: 19 })
);
