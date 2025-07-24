import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { findSegment } from '@/lib/healthDataHelpers/findSegment';
import { healthDataPointWithoutDeprecatedProps } from '@/lib/healthDataHelpers/withoutDeprecatedProps';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { SegmentInfo } from '@/lib/common-types';
import { segmentName } from '@/lib/healthDataHelpers/segmentName';

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
  const { name } = indicatorWithHealthDataForArea;
  const segments = segmentValues(indicatorWithHealthDataForArea);

  const {
    [SearchParams.SegmentationSex]: segSex = '',
    [SearchParams.SegmentationAge]: segAge = '',
    [SearchParams.SegmentationFrequency]: segFreq = '',
  } = searchState;

  const segmentInfo: SegmentInfo = {
    sex: valueOrBlank(segments.sex, segSex),
    age: valueOrBlank(segments.age, segAge),
    frequency: valueOrBlank(segments.frequency, segFreq),
  };

  let indicatorName = name;
  const flatIndicator = {
    ...indicatorWithHealthDataForArea,
    name: indicatorName,
    areaHealthData:
      indicatorWithHealthDataForArea?.areaHealthData?.map((areaHealthData) => {
        const segment = findSegment(
          areaHealthData.indicatorSegments ?? [],
          segmentInfo
        );
        const segmentHealthData =
          segment?.healthData?.map(healthDataPointWithoutDeprecatedProps) ?? [];

        if (segment) {
          indicatorName = `${name} (${segmentName(segment)})`;
        }

        return {
          ...areaHealthData,
          healthData: segmentHealthData,
          indicatorSegments: undefined,
        };
      }) ?? [],
  };

  flatIndicator.name = indicatorName;
  return flatIndicator;
};
