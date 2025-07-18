import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { useMemo } from 'react';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';

export const useLineChartOverTimeData = () => {
  const searchState = useSearchStateParams();

  const { healthData, indicatorMetaData } = useOneIndicatorData();
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
