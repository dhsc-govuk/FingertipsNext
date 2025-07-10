import { QueryClient } from '@tanstack/query-core';
import { act, render } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';
import { SessionProvider } from 'next-auth/react';

export const testRenderQueryClient = async (
  children: ReactNode,
  seedData: SeedData = {}
) => {
  let htmlContainer: HTMLElement | undefined;

  const Wrapper = testRenderWrapper(seedData);

  await act(async () => {
    const { container } = render(<Wrapper>{children}</Wrapper>);
    htmlContainer = container;
  });

  return {
    htmlContainer,
  };
};

export const testRenderWrapper = (
  seedData: SeedData,
  queryClient?: QueryClient
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const _queryClient = queryClient ?? new QueryClient();
    return (
      <SessionProvider>
        <QueryClientProvider client={_queryClient}>
          <SeedQueryCache seedData={seedData} />
          {children}
        </QueryClientProvider>
      </SessionProvider>
    );
  };
  Wrapper.displayName = 'TestRenderQueryHookWrapper';
  return Wrapper;
};
