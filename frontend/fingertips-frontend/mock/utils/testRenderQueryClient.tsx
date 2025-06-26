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
  const queryClient = new QueryClient();
  let htmlContainer: HTMLElement | null = null;

  await act(async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SeedQueryCache seedData={seedData} />
        {children}
      </QueryClientProvider>
    );
    htmlContainer = container;
  });

  return {
    htmlContainer,
  };
};
