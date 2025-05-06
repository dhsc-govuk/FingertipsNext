import { useQuery } from '@tanstack/react-query';
import { Area } from '@/generated-sources/ft-api-client';
import { getAreaTypeMembersUrl } from '@/components/shallow/apiUrls';

export const useApiAreaTypeMembersGet = (areaType?: string) => {
  const url = getAreaTypeMembersUrl(areaType ?? '');
  const query = useQuery<Area[]>({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json();
    },
    gcTime: 60 * 1000,
    enabled: !!areaType,
  });

  const areas = (query.data ?? []).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  return {
    areas,
    areasLoading: query.isLoading,
    areasError: query.error,
  };
};
