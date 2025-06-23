'use client';

import { LoaderProvider } from '@/context/LoaderContext';
import { SearchStateProvider } from '@/context/SearchStateContext';
import { Main } from 'govuk-react';
import styled from 'styled-components';
import { QueryClientProvider } from '@tanstack/react-query';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { ModalProvider } from '@/context/ModalContext';
import { FocusOnFragment } from '@/components/atoms/FocusOnFragment/FocusOnFragment';
import { Suspense } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const StyledMain = styled(Main)({
  minHeight: '80vh',
});

export function FTContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <ModalProvider>
        <SearchStateProvider>
          <LoaderProvider>
            <main>
              <StyledMain>{children}</StyledMain>
            </main>
            <Suspense>
              <FocusOnFragment />
            </Suspense>
          </LoaderProvider>
        </SearchStateProvider>
      </ModalProvider>
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
