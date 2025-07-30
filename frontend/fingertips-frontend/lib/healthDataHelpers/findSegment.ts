import {
  IndicatorSegment,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { SegmentationId } from '@/lib/common-types';
import {
  reportingPeriodLabelOrder,
  segmentValues,
} from '@/lib/healthDataHelpers/segmentValues';

export const findSegment = (
  indicatorSegments: IndicatorSegment[],
  segmentInfo: Record<SegmentationId, string>
) => {
  const values = segmentValues({
    areaHealthData: [{ indicatorSegments }],
  } as IndicatorWithHealthDataForArea);

  const defaultSex = values.sex.at(0) ?? '';
  const defaultAge = values.age.at(0) ?? '';
  const defaultReportingPeriod = values.reportingPeriod.at(0) ?? '';

  let {
    sex: selectedSex,
    age: selectedAge,
    reportingPeriod: selectedReportingPeriod,
  } = segmentInfo;

  if (selectedSex === '') {
    selectedSex = defaultSex;
  }

  if (selectedAge === '') {
    selectedAge = defaultAge;
  }

  if (selectedReportingPeriod === '') {
    selectedReportingPeriod = defaultReportingPeriod;
  }

  return indicatorSegments.find((segment) => {
    const { sex, age, reportingPeriod } = segment;

    const sexMatch =
      !sex ||
      (!selectedSex && sex.isAggregate) ||
      sex.value.toLowerCase() === selectedSex?.toLowerCase();

    const ageMatch =
      !age ||
      (!selectedAge && age.isAggregate) ||
      age.value.toLowerCase() === selectedAge?.toLowerCase();

    const reportingPeriodMatch =
      !reportingPeriod ||
      (!selectedReportingPeriod && reportingPeriod) ||
      selectedReportingPeriod.toLowerCase() ===
        reportingPeriodLabelOrder[reportingPeriod]?.label.toLowerCase();

    return sexMatch && ageMatch && reportingPeriodMatch;
  });
};
