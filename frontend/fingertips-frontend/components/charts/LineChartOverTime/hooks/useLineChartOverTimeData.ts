import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useLineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { useMemo } from 'react';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';

export const useLineChartOverTimeData = () => {
  const searchState = useSearchStateParams();
  const { [SearchParams.IndicatorsSelected]: indicatorIds } = searchState;

  const indicatorId = indicatorIds?.at(0) ?? '';

  const apiReqParams = useLineChartOverTimeRequestParams();

  const { healthData } = useApiGetHealthDataForAnIndicator(apiReqParams);

  const { indicatorMetaData } = useApiGetIndicatorMetaData(indicatorId);

  const isRequired = lineChartOverTimeIsRequired(searchState);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData || !isRequired) return null;
    const segmentedData = flattenSegment(healthData, searchState);
    return lineChartOverTimeData(indicatorMetaData, segmentedData, searchState);
  }, [healthData, indicatorMetaData, isRequired, searchState]);
};
