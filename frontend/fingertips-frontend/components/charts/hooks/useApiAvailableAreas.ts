import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Area } from '@/generated-sources/ft-api-client';

type UseApiAvailableAreasResult = Readonly<{
  availableAreas: Area[] | undefined;
  availableAreasLoading: boolean;
  availableAreasError: unknown;
}>;

export const useApiAvailableAreas = () => {
  const query = useQuery<Area[]>({
    // in future work we should alter the area filtering to also query
    queryKey: ['availableAreas'],
    // the queryFn is effectively empty because we won't ever use it
    queryFn: () => [] as Area[],
    // enabled is always false, because we always want the seeded data
    // we never want to query for it (we should revisit this)
    enabled: false,
  });

  return useMemo<UseApiAvailableAreasResult>(() => {
    return {
      availableAreas: query.data,
      availableAreasLoading: query.isLoading,
      availableAreasError: query.error,
    };
  }, [query.data, query.isLoading, query.error]);
};
