import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { useMemo } from 'react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';

export const useSingleIndicatorBasicTableData = () => {
  const searchState = useSearchStateParams();
  const { [SearchParams.AreasSelected]: areasSelected } = searchState;
  const { healthData, indicatorMetaData } = useOneIndicatorData();
  return useMemo(() => {
    if (!healthData || !indicatorMetaData) return null;

    const areaCode = areasSelected?.at(0) ?? areaCodeForEngland;
    const area = healthData.areaHealthData?.find(
      (healthData) => healthData.areaCode === areaCode
    );

    if (!area) return null;

    return singleIndicatorBasicTableData(area, indicatorMetaData);
  }, [areasSelected, healthData, indicatorMetaData]);
};
