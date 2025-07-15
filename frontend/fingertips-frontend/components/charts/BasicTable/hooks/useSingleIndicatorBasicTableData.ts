import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { useMemo } from 'react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const useSingleIndicatorBasicTableData = () => {
  const searchState = useSearchStateParams();
  const { [SearchParams.AreasSelected]: areasSelected } = searchState;
  const requestParams = useOneIndicatorRequestParams();
  const { indicatorMetaData } = useApiGetIndicatorMetaData(
    String(requestParams.indicatorId)
  );

  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

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
