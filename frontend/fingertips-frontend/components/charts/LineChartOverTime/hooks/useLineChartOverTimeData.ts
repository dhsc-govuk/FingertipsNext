import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { useMemo } from 'react';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';

export const useLineChartOverTimeData = () => {
  const searchState = useSearchStateParams();

  const { healthData, indicatorMetaData } = useOneIndicatorData();
  const isRequired = lineChartOverTimeIsRequired(searchState);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData || !isRequired) return null;

    const segmentedData = flattenSegment(healthData, searchState);

    return lineChartOverTimeData(indicatorMetaData, segmentedData, searchState);
  }, [healthData, indicatorMetaData, isRequired, searchState]);
};
