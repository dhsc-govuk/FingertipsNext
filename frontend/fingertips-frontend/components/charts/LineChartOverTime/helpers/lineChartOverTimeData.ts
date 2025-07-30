import { determineBenchmarkToUse } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import {
  BenchmarkComparisonMethod,
  Frequency,
  IndicatorWithHealthDataForArea,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { isSmallestReportingPeriod } from '@/lib/healthDataHelpers/isSmallestReportingPeriod';

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
  const isSmallestReportingPeriodFlag = isSmallestReportingPeriod(
    selectedReportingPeriod,
    reportingPeriodOptions,
    frequency
  );

  const chartOptions = generateStandardLineChartOptions(
    withoutEnglandOrGroup,
    true,
    benchmarkToUse,
    periodType,
    frequency,
    isSmallestReportingPeriodFlag,
    {
      indicatorName: name,
      englandData: englandData,
      benchmarkComparisonMethod: benchmarkComparisonMethod,
      groupIndicatorData: groupData,
      yAxisTitle,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetaData?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
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
    isSmallestReportingPeriod: isSmallestReportingPeriodFlag,
  };
};
