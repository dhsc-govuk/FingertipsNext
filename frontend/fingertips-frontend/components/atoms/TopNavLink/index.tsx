import { GovukColours } from '@/lib/styleHelpers/colours';
import NextLink from 'next/link';
import styled from 'styled-components';

export const TopNavLink = styled(NextLink)({
  'color': GovukColours.White,
  'textDecoration': 'none',
  'textDecorationSkipInk': 'none',
  'borderBottom': '1px solid transparent',
  'fontWeight': 700,
  'lineHeight': 1,
  ':hover': {
    borderBottomColor: GovukColours.White,
  },
  'display': 'inline-block',
  ':focus': {
    'color': GovukColours.Black,
    'backgroundColor': GovukColours.Yellow,
    'outline': `3px solid ${GovukColours.Yellow}`,
    ':hover': {
      borderBottomColor: GovukColours.Black,
    },
  },
});
