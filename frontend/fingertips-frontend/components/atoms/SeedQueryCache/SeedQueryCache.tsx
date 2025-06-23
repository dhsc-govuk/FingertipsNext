'use client';

import { useQueryClient } from '@tanstack/react-query';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';

interface SeedQueryCacheProps {
  seedData: SeedData;
}

export function SeedQueryCache({ seedData }: Readonly<SeedQueryCacheProps>) {
  const queryClient = useQueryClient();
  Object.entries(seedData).forEach(([url, data]) => {
    queryClient.setQueryData([url], data);
  });

  // needs to be a 'use client' component, but we need to generate
  // the seed data in a server ONLY component
  // therefore there is no need to return anything
  return null;
}
