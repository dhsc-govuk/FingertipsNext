import {
  determineBenchmarkToUse,
  getLatestPeriod,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import {
  BenchmarkComparisonMethod,
  Frequency,
  IndicatorWithHealthDataForArea,
  PeriodType,
  ReportingPeriod,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { reportingPeriodLabelOrder } from '@/lib/healthDataHelpers/segmentValues';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export const lineChartOverTimeData = (
  indicatorMetaData: IndicatorDocument,
  healthData: IndicatorWithHealthDataForArea,
  searchState: SearchStateParams,
  reportingPeriodOptions: string[]
) => {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.AreasSelected]: areasSelected = [],
    [SearchParams.SegmentationReportingPeriod]: selectedReportingPeriod,
  } = searchState;

  const benchmarkComparisonMethod = healthData?.benchmarkMethod;
  const polarity = healthData?.polarity;
  const { name } = healthData;

  const [withoutEngland, englandData] = findAndRemoveByAreaCode(
    healthData.areaHealthData ?? [],
    areaCodeForEngland
  );

  const [withoutEnglandOrGroup, groupData] = findAndRemoveByAreaCode(
    withoutEngland,
    selectedGroupCode
  );

  const latestPeriodNumber = getLatestPeriod(englandData?.healthData ?? []);
  const latestHealthDataPoint = englandData?.healthData?.find(
    (point) => convertDateToNumber(point.datePeriod?.to) === latestPeriodNumber
  );
  const latestDataPeriod = latestHealthDataPoint?.datePeriod;

  const shouldLineChartBeShownForOneArea =
    withoutEnglandOrGroup[0]?.healthData.length > 1 ||
    (englandData && englandData.healthData.length > 1);

  const shouldLineChartBeShownForTwoAreas =
    (withoutEnglandOrGroup[0]?.healthData.length > 1 ||
      benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles) &&
    areasSelected.length === 2;

  if (!shouldLineChartBeShownForOneArea && !shouldLineChartBeShownForTwoAreas)
    return null;

  const yAxisTitle = indicatorMetaData?.unitLabel
    ? `Value: ${indicatorMetaData?.unitLabel}`
    : undefined;

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const periodType =
    healthData.areaHealthData?.at(0)?.healthData?.at(0)?.datePeriod?.type ??
    PeriodType.Calendar;
  const frequency = healthData.frequency ?? Frequency.Annually;
  const reportingPeriod =
    selectedReportingPeriod ??
    reportingPeriodOptions[0] ??
    ReportingPeriod.Yearly;

  const reportingPeriodFlag =
    reportingPeriod.toLowerCase() === frequency.toLowerCase() ||
    (reportingPeriod.toLowerCase() ===
      reportingPeriodLabelOrder[ReportingPeriod.Yearly]?.label.toLowerCase() &&
      frequency === Frequency.Annually) ||
    (reportingPeriod.toLowerCase() ===
      reportingPeriodLabelOrder[
        ReportingPeriod.CumulativeQuarterly
      ]?.label.toLowerCase() &&
      frequency === Frequency.Quarterly);

  const chartOptions = generateStandardLineChartOptions(
    withoutEnglandOrGroup,
    true,
    benchmarkToUse,
    periodType,
    frequency,
    reportingPeriodFlag,
    {
      indicatorName: name,
      englandData: englandData,
      benchmarkComparisonMethod: benchmarkComparisonMethod,
      groupIndicatorData: groupData,
      yAxisTitle,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetaData?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
      latestDataPeriod: latestDataPeriod,
    }
  );

  return {
    chartOptions,
    areaData: withoutEnglandOrGroup,
    englandData,
    groupData,
    indicatorMetaData,
    polarity,
    benchmarkComparisonMethod,
    benchmarkToUse,
    periodType,
    frequency,
    reportingPeriodFlag,
    latestDataPeriod,
  };
};
