'use client';

import { Main } from 'govuk-react';
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
      <StyledMain>{children}</StyledMain>
    </main>
  );
}
