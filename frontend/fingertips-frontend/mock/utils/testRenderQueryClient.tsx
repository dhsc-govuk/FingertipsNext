import { QueryClient } from '@tanstack/query-core';
import { act, render } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';

export const testRenderQueryClient = async (
  children: ReactNode,
  seedData: SeedData = {}
) => {
  let htmlContainer: HTMLElement | null = null;

  const Wrapper = testRenderWrapper(seedData);

  await act(async () => {
    const { container } = render(<Wrapper>{children}</Wrapper>);
    htmlContainer = container;
  });

  return {
    htmlContainer,
  };
};

export const testRenderWrapper = (seedData: SeedData) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <SeedQueryCache seedData={seedData} />
        {children}
      </QueryClientProvider>
    );
  };
  Wrapper.displayName = 'TestRenderQueryHookWrapper';
  return Wrapper;
};
