import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import {
  Configuration,
  IndicatorsApi,
  IndicatorsQuartilesGetRequest,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { useSession } from 'next-auth/react';

export const useApiGetQuartiles = (options: IndicatorsQuartilesGetRequest) => {
  const { data: session } = useSession();
  const { indicatorIds = [] } = options;
  const queryKey = [
    session
      ? queryKeyFromRequestParams(
          EndPoints.QuartilesIncludingUnpublished,
          options
        )
      : queryKeyFromRequestParams(EndPoints.Quartiles, options),
  ];

  const query = useQuery<QuartileData[]>({
    queryKey,
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_FINGERTIPS_API_URL;
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      const indicatorsApiInstance = new IndicatorsApi(config);
      return (
        session
          ? await indicatorsApiInstance.indicatorsQuartilesAllGet(options)
          : await indicatorsApiInstance.indicatorsQuartilesGet(options)
      ).filter((q) => q.isAggregate === true);
    },
    enabled: indicatorIds.length >= 2,
  });

  return useMemo(() => {
    return {
      quartileData: query.data,
      quartileDataLoading: query.isLoading,
      quartileDataError: query.error,
    };
  }, [query.data, query.error, query.isLoading]);
};
