import { useQuery } from '@tanstack/react-query';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { getAreaUrl } from '@/components/shallow/queryKeys';

export const useApiAreasGet = (areaCode: string, areaType: string) => {
  const url = getAreaUrl(areaCode, true, areaType);
  const query = useQuery<AreaWithRelations>({
    queryKey: [url],
    queryFn: async () => {
      const result = await fetch(url).then((res) => res.json());

      return result;
    },
    gcTime: 60 * 1000,
  });
  console.log(query.data);
  const areas = (query.data?.children ?? []).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  return {
    areas,
    areasLoading: query.isLoading,
    areasError: query.error,
  };
};
