import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { findHealthPointsBySegmentation } from '@/lib/healthDataHelpers/findHealthPointsBySegmentation';
import { healthDataPointWithoutDeprecatedProps } from '@/lib/healthDataHelpers/withoutDeprecatedProps';

export const flattenSegment = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea,
  searchState: SearchStateParams
): IndicatorWithHealthDataForArea => {
  return {
    ...indicatorWithHealthDataForArea,
    areaHealthData:
      indicatorWithHealthDataForArea?.areaHealthData?.map((areaHealthData) => {
        const segmentHealthData = findHealthPointsBySegmentation(
          areaHealthData.indicatorSegments ?? [],
          searchState
        ).map(healthDataPointWithoutDeprecatedProps);
        return {
          ...areaHealthData,
          healthData: [...segmentHealthData],
          indicatorSegments: undefined,
        };
      }) ?? [],
  };
};
