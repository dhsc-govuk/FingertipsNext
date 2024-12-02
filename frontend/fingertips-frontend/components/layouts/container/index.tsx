'use client';

import { Main } from 'govuk-react';
import React from 'react';
import styled from 'styled-components';

export function FTContainer({ children }: { children: React.ReactNode }) {
  const StyledMain = styled(Main)({
    minHeight: '80vh',
  });

  return <StyledMain>{children}</StyledMain>;
}
