import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { useMemo } from 'react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { withoutYears } from '@/lib/healthDataHelpers/withoutYears';
import { Frequency } from '@/generated-sources/ft-api-client';
import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';
import { indicatorsSorted } from '@/lib/healthDataHelpers/indicatorsSorted';

export const useMultipleIndicatorBasicTableData = () => {
  const searchState = useSearchStateParams();
  const { [SearchParams.AreasSelected]: areasSelected } = searchState;
  const {
    healthData: multipleHealthData,
    indicatorMetaData: multipleIndicatorMetaData,
  } = useMultipleIndicatorData();
  return useMemo(() => {
    if (!multipleHealthData.length || !multipleIndicatorMetaData.length)
      return null;

    const sorted = indicatorsSorted(multipleHealthData);

    const dataForEachIndicator = sorted.flatMap((healthData) => {
      const indicatorMetaData = multipleIndicatorMetaData.find(
        ({ indicatorID }) => indicatorID === String(healthData.indicatorId)
      );

      if (!indicatorMetaData) return null;

      const cleanData = withoutYears(healthData);
      const areaCode = areasSelected?.at(0) ?? areaCodeForEngland;
      const area = cleanData.areaHealthData?.find(
        (healthData) => healthData.areaCode === areaCode
      );

      if (!area) return null;

      return singleIndicatorBasicTableData(
        area,
        indicatorMetaData,
        healthData.frequency ?? Frequency.Annually
      );
    });

    return dataForEachIndicator.filter((item) => !!item);
  }, [multipleHealthData, multipleIndicatorMetaData, areasSelected]);
};
