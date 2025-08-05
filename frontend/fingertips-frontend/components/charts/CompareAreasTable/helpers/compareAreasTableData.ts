import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  Frequency,
  IndicatorWithHealthDataForArea,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { getLatestPeriod } from '@/lib/chartHelpers/chartHelpers';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { isSmallestReportingPeriod } from '@/lib/healthDataHelpers/isSmallestReportingPeriod';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

export const compareAreasTableData = (
  healthData: IndicatorWithHealthDataForArea,
  searchState: SearchStateParams,
  reportingPeriodOptions: string[]
) => {
  const benchmarkComparisonMethod = healthData?.benchmarkMethod;
  const polarity = healthData?.polarity;

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.SegmentationReportingPeriod]: selectedReportingPeriod,
  } = searchState;

  const [withoutEngland, englandData] = findAndRemoveByAreaCode(
    healthData?.areaHealthData ?? [],
    areaCodeForEngland
  );

  const [withoutEnglandOrGroup, groupData] = findAndRemoveByAreaCode(
    withoutEngland,
    selectedGroupCode
  );

  const benchmarkToUse = benchmarkAreaSelected ?? areaCodeForEngland;

  const periodType =
    healthData.areaHealthData?.at(0)?.healthData?.at(0)?.datePeriod?.type ??
    PeriodType.Calendar;

  const frequency = healthData.frequency ?? Frequency.Annually;

  const latestPeriodNumber = getLatestPeriod(englandData?.healthData ?? []);
  const latestHealthDataPoint = englandData?.healthData?.find(
    (point) => convertDateToNumber(point.datePeriod?.to) === latestPeriodNumber
  );
  const latestDataPeriod = latestHealthDataPoint?.datePeriod;

  const isSmallestReportingPeriodFlag = isSmallestReportingPeriod(
    selectedReportingPeriod,
    reportingPeriodOptions,
    frequency
  );

  return {
    benchmarkComparisonMethod,
    polarity,
    healthIndicatorData: withoutEnglandOrGroup,
    groupData,
    englandData,
    benchmarkToUse,
    periodType,
    frequency,
    latestDataPeriod,
    isSmallestReportingPeriod: isSmallestReportingPeriodFlag,
  };
};
