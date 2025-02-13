'use client';

import { Link, Main, PhaseBanner } from 'govuk-react';
import React from 'react';
import styled from 'styled-components';

const StyledMain = styled(Main)({
  minHeight: '80vh',
});

export function FTContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <StyledMain>
        <PhaseBanner level="alpha">
          This is a new service - your <Link href="#">feedback</Link> will help
          us to improve it.
        </PhaseBanner>
        <br />
        {children}
      </StyledMain>
    </main>
  );
}
