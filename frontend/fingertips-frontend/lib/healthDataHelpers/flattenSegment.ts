import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { findHealthPointsBySegmentation } from '@/lib/healthDataHelpers/findHealthPointsBySegmentation';
import { healthDataPointWithoutDeprecatedProps } from '@/lib/healthDataHelpers/withoutDeprecatedProps';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { SegmentationId } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';

const valueOrBlank = (options: string[], value?: string) => {
  if (!value) return '';
  const lowerCaseOptions = options.map((option) => option.toLowerCase());
  const exists = lowerCaseOptions.includes(value.toLowerCase());
  return exists ? value.toLowerCase() : '';
};

export const flattenSegment = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea,
  searchState: SearchStateParams
): IndicatorWithHealthDataForArea => {
  const segments = segmentValues(indicatorWithHealthDataForArea);

  const {
    [SearchParams.SegmentationSex]: segSex = '',
    [SearchParams.SegmentationAge]: segAge = '',
    [SearchParams.SegmentationFrequency]: segFreq = '',
  } = searchState;

  const segmentInfo: Record<SegmentationId, string> = {
    sex: valueOrBlank(segments.sex, segSex),
    age: valueOrBlank(segments.age, segAge),
    frequency: valueOrBlank(segments.frequency, segFreq),
  };

  return {
    ...indicatorWithHealthDataForArea,
    areaHealthData:
      indicatorWithHealthDataForArea?.areaHealthData?.map((areaHealthData) => {
        const segmentHealthData = findHealthPointsBySegmentation(
          areaHealthData.indicatorSegments ?? [],
          segmentInfo
        ).map(healthDataPointWithoutDeprecatedProps);
        return {
          ...areaHealthData,
          healthData: [...segmentHealthData],
          indicatorSegments: undefined,
        };
      }) ?? [],
  };
};
