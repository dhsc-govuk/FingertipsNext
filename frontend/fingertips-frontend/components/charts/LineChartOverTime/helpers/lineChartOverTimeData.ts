import { determineBenchmarkToUse } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import {
  BenchmarkComparisonMethod,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

export const lineChartOverTimeData = (
  indicatorMetaData: IndicatorDocument,
  healthData: IndicatorWithHealthDataForArea,
  searchState: SearchStateParams
) => {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.AreasSelected]: areasSelected = [],
  } = searchState;

  const benchmarkComparisonMethod = healthData?.benchmarkMethod;
  const polarity = healthData?.polarity;

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

  const chartOptions = generateStandardLineChartOptions(
    withoutEnglandOrGroup,
    true,
    benchmarkToUse,
    {
      indicatorName: indicatorMetaData?.indicatorName,
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
  };
};
