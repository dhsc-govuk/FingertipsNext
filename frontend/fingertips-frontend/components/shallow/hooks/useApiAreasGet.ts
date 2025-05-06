import { useQuery } from '@tanstack/react-query';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { getAreaUrl } from '@/components/shallow/apiUrls';

export const useApiAreasGet = (areaCode: string, areaType: string) => {
  const url = getAreaUrl({
    areaCode,
    includeChildren: true,
    childAreaType: areaType,
  });
  const query = useQuery<AreaWithRelations>({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url);
      return await res.json();
    },
    gcTime: 60 * 1000,
  });

  const areas = (query.data?.children ?? []).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  return {
    areas,
    areasLoading: query.isLoading,
    areasError: query.error,
  };
};
