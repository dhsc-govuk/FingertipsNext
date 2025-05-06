'use client';

import { FC, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SeedData } from '@/components/shallow/seedQueryCache/seedQueryCache.types';

interface SeedQueryCacheProps {
  children?: ReactNode;
  seedData: SeedData;
}

export const SeedQueryCache: FC<SeedQueryCacheProps> = ({
  children,
  seedData,
}) => {
  const queryClient = useQueryClient();

  Object.entries(seedData).forEach(([url, data]) => {
    queryClient.setQueryData([url], data);
  });

  return (
    <>
      <div>
        <h2>Seeded</h2>
        <p>Seeded these urls...</p>
        {Object.keys(seedData).map((url) => (
          <pre key={url}>{url}</pre>
        ))}
      </div>
      {children}
    </>
  );
};
