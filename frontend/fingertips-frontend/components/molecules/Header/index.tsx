'use client';

import { Link, Main, PhaseBanner, TopNav } from 'govuk-react';
import styled from 'styled-components';

const ZeroPaddingMain = styled(Main)`
  padding: 0px;
`;

export function FTHeader() {
  return (
    <header>
      <TopNav />
      <ZeroPaddingMain>
        <PhaseBanner level="alpha">
          This is a new service - your <Link href="#">feedback</Link> will help
          us to improve it.
        </PhaseBanner>
      </ZeroPaddingMain>
    </header>
  );
}
