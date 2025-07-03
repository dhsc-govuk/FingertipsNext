'use client';

import { contactEmailLink } from '@/lib/links';
import { Link, Main, PhaseBanner, TopNav } from 'govuk-react';
import styled from 'styled-components';
import { siteTitle } from '@/lib/constants';
import { AuthHeader } from '../AuthHeader';
import { Session } from 'next-auth';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

const ServiceTitle = styled('span')({
  fontWeight: '700',
});

interface FTHeaderProps {
  chartPage?: boolean;
  session?: Session;
}

export function FTHeader({
  chartPage = false,
  session,
}: Readonly<FTHeaderProps>) {
  return (
    <header className={chartPage ? 'chart-page-header' : undefined}>
      <div>
        <AuthHeader session={session} />
        <TopNav
          serviceTitle={
            <TopNav.NavLink href="/">
              <ServiceTitle>{siteTitle}</ServiceTitle>
            </TopNav.NavLink>
          }
        ></TopNav>
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
