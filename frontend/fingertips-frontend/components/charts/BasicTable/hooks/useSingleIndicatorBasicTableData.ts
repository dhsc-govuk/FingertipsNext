import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { useMemo } from 'react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import { Frequency } from '@/generated-sources/ft-api-client';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { isSmallestReportingPeriod } from '@/lib/healthDataHelpers/isSmallestReportingPeriod';

export const useSingleIndicatorBasicTableData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.SegmentationReportingPeriod]: selectedReportingPeriod,
  } = searchState;
  const { healthData, indicatorMetaData } = useOneIndicatorData();

  return useMemo(() => {
    if (!healthData || !indicatorMetaData) return null;

    const frequency = healthData.frequency ?? Frequency.Annually;
    const { reportingPeriod } = segmentValues(healthData);
    const isSmallestReportingPeriodFlag = isSmallestReportingPeriod(
      selectedReportingPeriod,
      reportingPeriod,
      frequency
    );

    const areaCode = areasSelected?.at(0) ?? areaCodeForEngland;
    const area = healthData.areaHealthData?.find(
      (healthData) => healthData.areaCode === areaCode
    );

    if (!area) return null;

    return singleIndicatorBasicTableData(
      area,
      indicatorMetaData,
      frequency,
      isSmallestReportingPeriodFlag
    );
  }, [areasSelected, healthData, indicatorMetaData, selectedReportingPeriod]);
};
