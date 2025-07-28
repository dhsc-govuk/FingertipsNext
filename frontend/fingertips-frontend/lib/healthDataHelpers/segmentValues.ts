import {
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
  ReportingPeriod,
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

  const reportingPeriodOptions = segmentDropDownValuesForReportingPeriod(
    indicatorWithHealthDataForArea
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

const reportingPeriodLabelOrder: {
  [key in ReportingPeriod]?: { label: string; order: number };
} = {
  [ReportingPeriod.Monthly]: { label: 'Monthly', order: 1 },
  [ReportingPeriod.Quarterly]: { label: 'Quarterly', order: 2 },
  [ReportingPeriod.CumulativeQuarterly]: {
    label: 'Cumulative quarterly',
    order: 3,
  },
  [ReportingPeriod.Yearly]: { label: 'Yearly', order: 3 },
  [ReportingPeriod.TwoYearly]: { label: 'Two yearly', order: 5 },
  [ReportingPeriod.ThreeYearly]: { label: 'Three yearly', order: 6 },
  [ReportingPeriod.FiveYearly]: { label: 'Five yearly', order: 7 },
};

function getReportingPeriodLabels(
  periods: (ReportingPeriod | undefined)[]
): string[] {
  // Map to label, filter undefined and unmapped, deduplicate, and sort by order
  const labels = periods
    .filter((p): p is ReportingPeriod => p !== undefined)
    .map((p) => reportingPeriodLabelOrder[p]?.label)
    .filter((label): label is string => !!label);

  const uniqueLabels = Array.from(new Set(labels));
  return uniqueLabels.sort(
    (a, b) =>
      (Object.values(reportingPeriodLabelOrder).find((v) => v?.label === a)
        ?.order ?? 99) -
      (Object.values(reportingPeriodLabelOrder).find((v) => v?.label === b)
        ?.order ?? 99)
  );
}

export const segmentDropDownValuesForReportingPeriod = (
  indicatorWithHealthDataForArea: IndicatorWithHealthDataForArea
): string[] => {
  const periods: (ReportingPeriod | undefined)[] = [];

  indicatorWithHealthDataForArea.areaHealthData?.forEach(
    ({ indicatorSegments }) => {
      indicatorSegments?.forEach((segment) => {
        periods.push(segment.reportingPeriod);
      });
    }
  );

  return getReportingPeriodLabels(periods);
};
