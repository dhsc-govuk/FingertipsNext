import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useInequalitiesRequestParams } from '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesData } from '@/components/charts/Inequalities/helpers/inequalitiesData';
import { indicatorWithHealthDataForAreaWithoutSegmentation } from '@/lib/healthDataHelpers/indicatorWithHealthDataForAreaWithoutSegmentation';
import { ReportingPeriod } from '@/generated-sources/ft-api-client';

export const useInequalitiesData = (chartType = ChartType.SingleTimePeriod) => {
  const searchState = useSearchStateParams();
  const { indicatorMetaData } = useIndicatorMetaData();
  const requestParams = useInequalitiesRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData) return null;

    const withoutOtherReportingPeriods = {
      ...healthData,
      areaHealthData: healthData.areaHealthData?.map((item) => ({
        ...item,
        indicatorSegments: item.indicatorSegments?.filter(
          (segment) => segment.reportingPeriod === ReportingPeriod.Yearly
        ),
      })),
    };

    const withoutSegments = indicatorWithHealthDataForAreaWithoutSegmentation(
      withoutOtherReportingPeriods
    );

    const data = inequalitiesData(
      searchState,
      indicatorMetaData,
      withoutSegments,
      chartType
    );

    if (!data) return null;
    return data;
  }, [chartType, healthData, indicatorMetaData, searchState]);
};
