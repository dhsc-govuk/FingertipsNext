import { getHealthDataForAnIndicatorUrl } from '@/components/shallow/apiUrls';
import { useQuery } from '@tanstack/react-query';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

export const useApiHealthDataForAnIndicatorGet = (
  indicatorId: number,
  options: {
    areaCodes?: string[];
    inequalities?: string[];
    areaType?: string;
  }
) => {
  const url = getHealthDataForAnIndicatorUrl(indicatorId, options);
  const query = useQuery<IndicatorWithHealthDataForArea>({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url);
      console.log(url);
      return await res.json();
    },
    gcTime: 60 * 1000,
  });

  return {
    healthData: query.data,
    healthDataLoading: query.isLoading,
    healthDataError: query.error,
  };
};
