'use client';

import { Link } from '@/components/atoms/Link';
import { contactEmailLink } from '@/lib/links';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { Main, PhaseBanner, TopNav } from 'govuk-react';
import NextLink from 'next/link';
import styled from 'styled-components';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

const TopNavLink = styled(NextLink)({
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

const ServiceTitle = styled('span')({
  fontWeight: '700',
});

export function FTHeader() {
  return (
    <header>
      <TopNav
        serviceTitle={
          <TopNavLink href="/">
            <ServiceTitle>Access public health data</ServiceTitle>
          </TopNavLink>
        }
      />
      <ZeroPaddingMain>
        <PhaseBanner level="alpha">
          This is a new service - your{' '}
          <Link href={contactEmailLink}>feedback</Link> will help us to improve
          it.
        </PhaseBanner>
      </ZeroPaddingMain>
    </header>
  );
}
