import {
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
  SexData,
} from '@/generated-sources/ft-api-client';

import { SegmentationId } from '@/lib/common-types';

interface OptionInfo {
  default: string;
  values: string[];
}

export const segmentValues = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea
): Record<SegmentationId, string[]> => {
  const sexOptions = segmentDropDownValuesForSegmentation(
    indicatorWithHealthDataForArea,
    SegmentationId.Sex
  );

  const ageOptions = segmentDropDownValuesForSegmentation(
    indicatorWithHealthDataForArea,
    SegmentationId.Age
  );

  const reportingPeriodOptions = segmentDropDownValuesForSegmentation(
    indicatorWithHealthDataForArea,
    SegmentationId.ReportingPeriod
  );

  return {
    [SegmentationId.Sex]: sexOptions,
    [SegmentationId.Age]: ageOptions,
    [SegmentationId.ReportingPeriod]: reportingPeriodOptions,
  };
};

const segmentDropDownValuesForSegmentation = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea,
  segmentationId: SegmentationId
): string[] => {
  const optionsInfo: OptionInfo = { default: '', values: [] };

  const { areaHealthData = [] } = indicatorWithHealthDataForArea;

  areaHealthData.forEach(({ indicatorSegments }) => {
    if (!indicatorSegments) return;

    indicatorSegments.forEach((segment) => {
      const seg = segment[segmentationId as keyof IndicatorSegment];
      if (!seg) return;

      const { value, isAggregate } = seg as SexData;
      if (isAggregate) {
        optionsInfo.default = value;
        return;
      }

      if (optionsInfo.values.includes(value)) return;

      optionsInfo.values.push(value);
    });
  });

  const alphabetical = optionsInfo.values.toSorted((a, b) =>
    a.localeCompare(b)
  );
  if (segmentationId === SegmentationId.Sex) {
    alphabetical.reverse();
  }
  return [optionsInfo.default, ...alphabetical].filter((i) => !!i);
};
