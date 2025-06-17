'use client';

import { useQueryClient } from '@tanstack/react-query';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { StyledDiv } from '@/components/atoms/SeedQueryCache/SeedQueryCache.styles';

interface SeedQueryCacheProps {
  seedData: SeedData;
}

export function SeedQueryCache({ seedData }: Readonly<SeedQueryCacheProps>) {
  const queryClient = useQueryClient();
  const keys = Object.keys(seedData);
  if (keys.length === 0) return null;

  Object.entries(seedData).forEach(([url, data]) => {
    queryClient.setQueryData([url], data);
  });

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <StyledDiv>
      <p>Seeded these urls...</p>
      {keys.map((url) => (
        <pre key={url}>{url}</pre>
      ))}
    </StyledDiv>
  );
}
