'use client';

import { contactEmailLink } from '@/lib/links';
import { Link, Main, PhaseBanner, TopNav } from 'govuk-react';
import styled from 'styled-components';
import { Session } from 'next-auth';
import { AuthHeader } from '../AuthHeader';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

const ServiceTitle = styled('span')({
  fontWeight: '700',
});

interface FTHeaderProps {
  session: Session | null;
}

export function FTHeader({ session }: FTHeaderProps) {
  return (
    <header>
      <div>
        <div>
          <AuthHeader session={session} />
          <TopNav
            serviceTitle={
              <TopNav.NavLink href="/">
                <ServiceTitle>Access public health data</ServiceTitle>
              </TopNav.NavLink>
            }
          ></TopNav>
        </div>
      </div>
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
