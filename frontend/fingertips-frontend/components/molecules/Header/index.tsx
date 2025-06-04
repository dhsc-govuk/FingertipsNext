'use client';

import { Link } from '@/components/atoms/Link';
import { TopNavLink } from '@/components/atoms/TopNavLink';
import { contactEmailLink } from '@/lib/links';
import { Main, PhaseBanner, TopNav } from 'govuk-react';
import styled from 'styled-components';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

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
