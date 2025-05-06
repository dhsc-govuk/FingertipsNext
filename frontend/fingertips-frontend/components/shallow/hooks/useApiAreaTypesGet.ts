import { useQuery } from '@tanstack/react-query';
import { AreaType } from '@/generated-sources/ft-api-client';
import { getAreaTypesUrl } from '@/components/shallow/apiUrls';
import { areaTypeSorter } from '@/lib/areaFilterHelpers/areaTypeSorter';

export const useApiAreaTypesGet = () => {
  const url = getAreaTypesUrl();
  const query = useQuery<AreaType[]>({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json();
    },
    gcTime: 60 * 1000,
  });

  return {
    areaTypes: areaTypeSorter(query.data ?? []),
    areaTypesLoading: query.isLoading,
    areaTypesError: query.error,
  };
};
