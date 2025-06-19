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

  if (process.env.NODE_ENV === 'development') {
    const queryKeys = Object.keys(seedData).join('\n');
    console.log(`SEEDING DATA FOR REACT QUERY\n${queryKeys}`);
  }

  return null;
}
