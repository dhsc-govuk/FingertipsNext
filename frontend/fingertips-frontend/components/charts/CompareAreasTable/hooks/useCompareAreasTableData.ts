import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';

export const useCompareAreasTableData = () => {
  const searchState = useSearchStateParams();
  const { healthData, indicatorMetaData } = useOneIndicatorData();

  return useMemo(() => {
    if (!healthData) return null;

    const segmentedData = flattenSegment(healthData, searchState);
    const { reportingPeriod } = segmentValues(healthData);

    return {
      indicatorMetaData,
      name: segmentedData.name,
      ...compareAreasTableData(segmentedData, searchState, reportingPeriod),
    };
  }, [healthData, searchState, indicatorMetaData]);
};
