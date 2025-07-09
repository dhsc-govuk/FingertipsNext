import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { useMemo } from 'react';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { Session } from 'next-auth';

export const useLineChartOverTimeData = (session: Session | null) => {
  const searchState = useSearchStateParams();
  const { [SearchParams.IndicatorsSelected]: indicatorIds } = searchState;

  const indicatorId = indicatorIds?.at(0) ?? '';

  const apiReqParams = useOneIndicatorRequestParams();

  const { healthData } = useApiGetHealthDataForAnIndicator(
    apiReqParams,
    session
  );

  const { indicatorMetaData } = useApiGetIndicatorMetaData(indicatorId);

  const isRequired = lineChartOverTimeIsRequired(searchState);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData || !isRequired) return null;

    // the api work to allow segmentation for quintiles is not ready yet
    // so we need to handle it in the old way for now.
    const isNotQuintiles =
      healthData.benchmarkMethod !== BenchmarkComparisonMethod.Quintiles;

    const segmentedData = isNotQuintiles
      ? flattenSegment(healthData, searchState)
      : healthData;
    return lineChartOverTimeData(indicatorMetaData, segmentedData, searchState);
  }, [healthData, indicatorMetaData, isRequired, searchState]);
};
