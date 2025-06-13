'use client';

import { contactEmailLink } from '@/lib/links';
import { Link, Main, PhaseBanner, TopNav } from 'govuk-react';
import styled from 'styled-components';
import { AuthHeader } from '../AuthHeader';
import { Auth } from '@/lib/auth/authHandlers';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

const ServiceTitle = styled('span')({
  fontWeight: '700',
});

interface FTHeaderProps {
  auth?: Auth;
}

export function FTHeader({ auth }: FTHeaderProps) {
  return (
    <header>
      <div>
        <div>
          <AuthHeader auth={auth} />
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
