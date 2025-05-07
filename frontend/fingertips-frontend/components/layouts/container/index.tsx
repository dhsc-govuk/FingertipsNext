'use client';

import { LoaderProvider } from '@/context/LoaderContext';
import { SearchStateProvider } from '@/context/SearchStateContext';
import { Main } from 'govuk-react';
import React from 'react';
import styled from 'styled-components';
import { QueryClientProvider } from '@tanstack/react-query';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { MEDIA_QUERIES, SITE_WIDTH, SPACING } from '@govuk-react/constants';
import { usePathname } from 'next/navigation';

const StyledMain = styled(Main)({
  minHeight: '80vh',
});

const OuterContainer = styled('div')({
  paddingTop: SPACING.SCALE_5,
  display: 'flex',
  justifyContent: 'center',
  minHeight: '80vh',
});

interface InnerContainerProps {
  width?: string | number;
}

const InnerContainer = styled('div')<InnerContainerProps>(({ width }) => ({
  'maxWidth': width ?? SITE_WIDTH,
  'marginLeft': SPACING.SCALE_3,
  'marginRight': SPACING.SCALE_3,
  'textAlign': 'left',
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginLeft: SPACING.SCALE_5,
    marginRight: SPACING.SCALE_5,
  },
  '@media only screen and (min-width:1020px)': {
    margin: '0 auto',
  },
}));
export function FTContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathName = usePathname();
  const width = pathName === '/chart' ? '100%' : SITE_WIDTH;
  return (
    <QueryClientProvider client={reactQueryClient}>
      <SearchStateProvider>
        <LoaderProvider>
          <main>
            <OuterContainer>
              <InnerContainer width={width}>{children}</InnerContainer>
            </OuterContainer>
          </main>
        </LoaderProvider>
      </SearchStateProvider>
    </QueryClientProvider>
  );
}
